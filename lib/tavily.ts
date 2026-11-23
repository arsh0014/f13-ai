/**
 * Intelligent Tavily Search Engine & In-Memory Cache
 * Minimizes latency by selectively executing external searches only when current/real-time information is needed.
 */

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface TavilySearchResponse {
  query: string;
  results: TavilySearchResult[];
  durationMs: number;
  fromCache: boolean;
}

// In-memory search cache with 15-minute TTL to prevent duplicate search calls
interface CacheEntry {
  results: TavilySearchResult[];
  timestamp: number;
}

const SEARCH_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Intelligent Decision Layer:
 * Determines whether a user query genuinely needs real-time web search or can be answered directly.
 */
export function shouldPerformSearch(query: string): boolean {
  if (!query || typeof query !== "string") return false;
  const q = query.trim().toLowerCase();

  // 1. Never search for simple greetings, definitions, or standard concepts
  const isDefinitionOrConcept =
    /^(what is|what are|explain|define|how does|how do|difference between)\s+[a-z0-9\s-]+$/i.test(
      q,
    ) &&
    !q.includes("latest") &&
    !q.includes("recent") &&
    !q.includes("2025") &&
    !q.includes("2026") &&
    !q.includes("today") &&
    !q.includes("news");

  if (isDefinitionOrConcept) {
    return false;
  }

  // 2. Never search for F13-specific queries (handled by verified local knowledge base)
  if (
    q.includes("f13") ||
    q.includes("f13.tech") ||
    q.includes("f13 technologies")
  ) {
    return false;
  }

  // 3. Trigger search ONLY when explicit temporal keywords or current research is requested
  const realTimeKeywords = [
    "latest",
    "recent",
    "trends",
    "new developments",
    "current threats",
    "in 2025",
    "in 2026",
    "news",
    "breaking",
    "recent cyberattacks",
    "current statistics",
    "research the latest",
    "newest",
    "state of the art",
  ];

  const hasTemporalIntent = realTimeKeywords.some((keyword) =>
    q.includes(keyword),
  );

  return hasTemporalIntent;
}

/**
 * Clean & normalize cache key
 */
function getCacheKey(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim()
    .slice(0, 100);
}

/**
 * Execute Tavily Search with timeout, cache, and error resilience
 */
export async function executeTavilySearch(
  query: string,
): Promise<TavilySearchResponse | null> {
  const apiKey = (
    process.env.TAVILY_API_KEY ||
    process.env.NEXT_PUBLIC_TAVILY_API_KEY ||
    ""
  ).trim();

  // If no API key is configured, log warning and gracefully return null
  if (!apiKey) {
    return null;
  }

  const cacheKey = getCacheKey(query);
  const now = Date.now();

  // Check in-memory cache
  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return {
      query,
      results: cached.results,
      durationMs: 0,
      fromCache: true,
    };
  }

  const startTime = Date.now();

  try {
    // 3.5s timeout prevents Tavily from delaying the user experience
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic", // Fast response tier
        include_answer: false,
        max_results: 3, // Keep context compact & fast
        include_images: false,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `[Tavily Search Warning]: API returned status ${response.status}`,
      );
      return null;
    }

    const data = await response.json();
    const results: TavilySearchResult[] = (data.results || []).map(
      (r: any) => ({
        title: String(r.title || "External Source"),
        url: String(r.url || ""),
        content: String(r.content || "").slice(0, 300), // Trim snippet length for fast LLM ingestion
        score: typeof r.score === "number" ? r.score : undefined,
      }),
    );

    // Save to cache
    SEARCH_CACHE.set(cacheKey, {
      results,
      timestamp: now,
    });

    return {
      query,
      results,
      durationMs: Date.now() - startTime,
      fromCache: false,
    };
  } catch (error: any) {
    // Graceful fallback: do not throw or crash the main AI conversation
    if (error?.name === "AbortError") {
      console.warn("[Tavily Search Warning]: Request timed out (3.5s limit).");
    } else {
      console.warn("[Tavily Search Warning]:", error?.message || error);
    }
    return null;
  }
}

/**
 * Format search results into a clean, compact markdown context block for the model
 */
export function formatSearchContext(
  searchResponse: TavilySearchResponse | null,
): string {
  if (
    !searchResponse ||
    !searchResponse.results ||
    searchResponse.results.length === 0
  ) {
    return "";
  }

  const items = searchResponse.results
    .map(
      (r, idx) => `[${idx + 1}] "${r.title}" - ${r.url}\nSummary: ${r.content}`,
    )
    .join("\n\n");

  return `\n\n--- REAL-TIME EXTERNAL RESEARCH CONTEXT (Current Web Verification via Tavily) ---\n${items}\nUse these verified recent facts and cite sources with their links where relevant.\n------------------------------------------------------------------------\n`;
}
