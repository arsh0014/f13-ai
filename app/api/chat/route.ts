import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { isAllowedRequestContext } from "../request-context";
import { F13_SYSTEM_PROMPT } from "@/lib/f13-knowledge";
import {
  shouldPerformSearch,
  executeTavilySearch,
  formatSearchContext,
} from "@/lib/tavily";

export const maxDuration = 30;

// High-performance default models
const DEFAULT_FAST_MODEL = "gemini-flash-lite-latest";
const DEFAULT_REASONING_MODEL = "gemini-3.5-flash";

/**
 * Intelligent Intent Classifier:
 * Routes standard questions, definitions, and consulting requests to the ultra-fast Flash tier,
 * and multi-step enterprise architectural design to the reasoning tier.
 */
function determineModelRoute(query: string): {
  modelName: string;
  isComplexReasoning: boolean;
} {
  // Check for explicit user environment override
  if (process.env.AI_MODEL || process.env.GEMINI_MODEL) {
    return {
      modelName: (process.env.AI_MODEL || process.env.GEMINI_MODEL)!,
      isComplexReasoning: false,
    };
  }

  const q = query.toLowerCase();
  const complexIndicators = [
    "complete technology architecture",
    "system architecture",
    "technology architecture",
    "enterprise architecture",
    "microservices architecture",
    "suggest a complete technology",
    "multi-tier architecture",
    "detailed technical design",
  ];

  const isComplex = complexIndicators.some((indicator) =>
    q.includes(indicator),
  );
  const fastModel = process.env.GEMINI_MODEL_FAST || DEFAULT_FAST_MODEL;
  const reasoningModel =
    process.env.GEMINI_MODEL_REASONING || DEFAULT_REASONING_MODEL;

  return {
    modelName: isComplex ? reasoningModel : fastModel,
    isComplexReasoning: isComplex,
  };
}

/**
 * Extract latest user query text from messages array
 */
function extractLatestUserQuery(messages: any[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "user") {
      if (typeof msg.content === "string") return msg.content;
      if (Array.isArray(msg.parts)) {
        const textPart = msg.parts.find((p: any) => p.type === "text");
        if (textPart?.text) return textPart.text;
      }
    }
  }
  return "";
}

export async function POST(req: Request) {
  const requestStartTime = Date.now();

  try {
    if (!isAllowedRequestContext(req)) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const rawMessages = body.messages || [];

    const googleApiKey = (
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      ""
    ).trim();
    const openaiApiKey = (process.env.OPENAI_API_KEY || "").trim();

    if (!googleApiKey && !openaiApiKey) {
      return new Response(
        JSON.stringify({
          error:
            "No API key provided. Please set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY in your .env.local file.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Extract the latest user query for routing and search decision
    const latestUserQuery = extractLatestUserQuery(rawMessages);

    // Parallel Operations:
    // 1. Determine model routing
    // 2. Intelligent Tavily search (only when query genuinely requires current/real-time info)
    // 3. Conversation context pruning (sliding window of last 10 messages)
    const { modelName, isComplexReasoning } =
      determineModelRoute(latestUserQuery);

    const needSearch = shouldPerformSearch(latestUserQuery);
    const searchPromise = needSearch
      ? executeTavilySearch(latestUserQuery)
      : Promise.resolve(null);

    // Prune conversation history to sliding window of last 10 turns to keep token overhead minimal
    const prunedMessages = rawMessages.slice(-10);

    // Normalize messages format for AI SDK
    const normalizedMessages = prunedMessages.map((m: any) => {
      if (!m.parts && typeof m.content === "string") {
        return {
          ...m,
          parts: [{ type: "text", text: m.content }],
        };
      }
      return m;
    });

    const [modelMessages, searchResult] = await Promise.all([
      convertToModelMessages(normalizedMessages),
      searchPromise,
    ]);

    // Construct dynamically augmented system prompt if real-time web context was retrieved
    const dynamicSystemPrompt = searchResult
      ? `${F13_SYSTEM_PROMPT}${formatSearchContext(searchResult)}`
      : F13_SYSTEM_PROMPT;

    // Initialize provider with thinking configuration
    const googleProvider = googleApiKey
      ? createGoogleGenerativeAI({ apiKey: googleApiKey })
      : null;
    const openaiProvider = openaiApiKey
      ? createOpenAI({ apiKey: openaiApiKey })
      : null;

    const selectedModel = googleProvider
      ? googleProvider(modelName)
      : openaiProvider!(modelName || "gpt-4o-mini");

    let firstTokenTime: number | null = null;

    // Structured performance telemetry
    console.log(
      `[PERF INITIATE] Query: "${latestUserQuery.slice(0, 45)}" | Model: ${modelName} | Route: ${isComplexReasoning ? "REASONING" : "FAST"} | Search: ${
        searchResult
          ? `${searchResult.durationMs}ms (cache: ${searchResult.fromCache}, results: ${searchResult.results.length})`
          : needSearch
            ? "ATTEMPTED (NO KEY OR TIMEOUT)"
            : "DIRECT (NO SEARCH NEEDED)"
      }`,
    );

    // Only apply thinkingConfig on models that support reasoning (e.g. gemini-3.5-flash / gemini-2.5-pro).
    // Flash-lite models reject thinkingConfig parameters.
    const supportsThinking =
      Boolean(googleProvider) &&
      (modelName.includes("3.5") ||
        modelName.includes("pro") ||
        modelName.includes("3.7"));

    const providerOptions: any = {};
    if (supportsThinking) {
      providerOptions.google = {
        thinkingConfig: {
          thinkingBudget: isComplexReasoning ? 1024 : 0,
        },
      };
    }

    const result = streamText({
      model: selectedModel,
      system: dynamicSystemPrompt,
      messages: modelMessages,
      ...(supportsThinking ? { providerOptions } : {}),
      onChunk({ chunk }) {
        if (
          !firstTokenTime &&
          chunk.type === "text-delta" &&
          chunk.text.trim().length > 0
        ) {
          firstTokenTime = Date.now() - requestStartTime;
          console.log(
            `[PERF TTFT] Time to first visible token: ${firstTokenTime}ms (${modelName})`,
          );
        }
      },
      onFinish({ usage }) {
        const totalDuration = Date.now() - requestStartTime;
        console.log(
          `[PERF COMPLETE] Total: ${totalDuration}ms | TTFT: ${firstTokenTime ?? totalDuration}ms | Model: ${modelName} | Tokens: ${usage?.totalTokens ?? "N/A"}`,
        );
      },
      onError({ error }) {
        console.error("[StreamText Error]:", error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError(error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (
          msg.toLowerCase().includes("quota") ||
          msg.toLowerCase().includes("rate limit") ||
          msg.includes("429")
        ) {
          return "Google AI Studio free tier rate limit was briefly reached. Please wait a moment or explore our recommended F13 solutions below.";
        }
        return `AI service notification: ${msg}`;
      },
    });
  } catch (error: any) {
    console.error("[POST /api/chat Error]:", error);
    return new Response(
      JSON.stringify({
        error:
          error?.message || "An unexpected error occurred in the AI assistant.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
