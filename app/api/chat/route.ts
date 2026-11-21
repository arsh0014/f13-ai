import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";
import { isAllowedRequestContext } from "../request-context";

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!isAllowedRequestContext(req)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const googleApiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

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

  // Normalize messages in case content is passed as plain string
  const normalizedMessages = (messages || []).map((m: any) => {
    if (!m.parts && typeof m.content === "string") {
      return {
        ...m,
        parts: [{ type: "text", text: m.content }],
      };
    }
    return m;
  });

  // Use active, tested models with gemini-3-flash-preview as the primary fast model
  const model = googleApiKey
    ? createGoogleGenerativeAI({ apiKey: googleApiKey })(
        process.env.AI_MODEL || "gemini-3-flash-preview",
      )
    : createOpenAI({ apiKey: openaiApiKey! })(
        process.env.AI_MODEL || "gpt-4o-mini",
      );

  const result = streamText({
    model,
    messages: await convertToModelMessages(normalizedMessages),
    onError({ error }) {
      console.error("[StreamText Error]:", error);
    },
  });

  return result.toUIMessageStreamResponse({
    onError(error) {
      const msg = error instanceof Error ? error.message : String(error);
      return `AI service notification: ${msg}`;
    },
  });
}
