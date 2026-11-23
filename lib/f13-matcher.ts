import { F13_COMPANY_INFO, F13_VERIFIED_SERVICES } from "./f13-knowledge";

export interface F13RecommendationData {
  relevant: boolean;
  personalizedIntro: string;
  services: Array<{
    name: string;
    icon: string;
    description: string;
    relevanceReason: string;
    url: string;
  }>;
  whyF13: string[];
  businessValue: string[];
  cta: {
    discussUrl: string;
    exploreUrl: string;
  };
}

/**
 * Safely parse a JSON string from an f13-recommendation code block
 */
export function parseF13Recommendation(
  raw: string,
): F13RecommendationData | null {
  if (!raw || typeof raw !== "string") return null;

  try {
    // Trim and find JSON bounds
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }

    const jsonString = raw.substring(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(jsonString);

    if (parsed && typeof parsed === "object" && parsed.relevant !== false) {
      return {
        relevant: true,
        personalizedIntro:
          typeof parsed.personalizedIntro === "string"
            ? parsed.personalizedIntro
            : "F13 Technologies offers tailored consulting and technology implementation to support your project.",
        services: Array.isArray(parsed.services)
          ? parsed.services.slice(0, 4).map((s: any) => ({
              name: String(s.name || "Technology Consulting"),
              icon: String(s.icon || "Cloud"),
              description: String(s.description || ""),
              relevanceReason: String(
                s.relevanceReason ||
                  "Directly supports your project requirements.",
              ),
              url: String(s.url || F13_COMPANY_INFO.servicesUrl),
            }))
          : [],
        whyF13: Array.isArray(parsed.whyF13)
          ? parsed.whyF13.map(String).slice(0, 4)
          : [
              "Deep technology expertise aligned with enterprise standards.",
              "Solutions customized to your business goals and architecture.",
              "Strategic consulting combined with hands-on technology execution.",
            ],
        businessValue: Array.isArray(parsed.businessValue)
          ? parsed.businessValue.map(String).slice(0, 4)
          : [
              "Improved operational efficiency through modern engineering.",
              "Enhanced security posture and compliance alignment.",
              "Scalable, future-ready infrastructure built for growth.",
            ],
        cta: {
          discussUrl: parsed.cta?.discussUrl || F13_COMPANY_INFO.discussUrl,
          exploreUrl: parsed.cta?.exploreUrl || F13_COMPANY_INFO.servicesUrl,
        },
      };
    }
  } catch {
    // If JSON parsing fails during streaming or malformed
    return null;
  }

  return null;
}

/**
 * Irrelevant / non-business indicators (trivia, common knowledge, jokes, greetings)
 */
const IRRELEVANT_PATTERNS = [
  /\bcapital of\b/i,
  /\bwho is\b/i,
  /\bwho was\b/i,
  /\bweather in\b/i,
  /\btell me a joke\b/i,
  /\brecipe for\b/i,
  /\btranslate to\b/i,
  /\bdefine\s+[a-z]+$/i,
  /\blyrics of\b/i,
  /\bpresident of\b/i,
  /\bmovie recommendations?\b/i,
];

/**
 * Check whether a user query represents a business/technology consulting requirement
 */
export function isQueryRelevantToF13(query: string): boolean {
  if (!query || query.trim().length < 5) return false;

  const lower = query.toLowerCase().trim();

  // Explicit check for non-business trivia
  for (const pattern of IRRELEVANT_PATTERNS) {
    if (pattern.test(lower)) {
      return false;
    }
  }

  // Count matches across verified service keywords
  let matchCount = 0;
  for (const service of F13_VERIFIED_SERVICES) {
    for (const kw of service.keywords) {
      if (lower.includes(kw)) {
        matchCount++;
        break;
      }
    }
  }

  // Also check common project intent phrases
  const hasProjectIntent =
    /\b(want to|need to|looking to|how to build|how to migrate|how to develop|automate|implement|deploy|architect|scale|protect|audit|consulting)\b/i.test(
      lower,
    );

  return matchCount > 0 || (hasProjectIntent && lower.length > 15);
}

/**
 * Synthesize a personalized F13 recommendation from user query intent and verified knowledge
 */
export function synthesizeF13Recommendation(
  userQuery: string,
): F13RecommendationData | null {
  if (!isQueryRelevantToF13(userQuery)) {
    return null;
  }

  const lower = userQuery.toLowerCase();

  // Score services by keyword match
  const scored = F13_VERIFIED_SERVICES.map((service) => {
    let score = 0;
    for (const kw of service.keywords) {
      if (lower.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    return { service, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // If no direct keyword match but has general tech intent, select cloud & process consulting
  const matchedServices =
    scored.length > 0
      ? scored.slice(0, 3).map((item) => item.service)
      : [F13_VERIFIED_SERVICES[0], F13_VERIFIED_SERVICES[4]];

  // Generate personalized introduction
  let personalizedIntro = `Exploring technology solutions for your project? F13 Technologies provides specialized consulting and hands-on implementation across ${matchedServices.map((s) => s.name).join(" and ")} to help turn your goals into scalable results.`;

  if (/ai|chatbot|machine learning|nlp|analytics/i.test(lower)) {
    personalizedIntro =
      "Looking to implement AI, conversational chatbots, or advanced analytics? F13 Technologies delivers end-to-end AI consulting, model integration, and automated intelligence pipelines tailored to your enterprise goals.";
  } else if (
    /security|cyber|hack|breach|firewall|zero trust|compliance|hipaa/i.test(
      lower,
    )
  ) {
    personalizedIntro =
      "Strengthening your enterprise security posture? F13 Technologies provides comprehensive Network Security and Cyber Risk Advisory to defend against vulnerabilities and ensure regulatory compliance.";
  } else if (
    /cloud|aws|azure|migrate|migration|devops|kubernetes/i.test(lower)
  ) {
    personalizedIntro =
      "Planning a cloud migration or infrastructure modernization? F13 Technologies provides strategic Cloud Consulting to ensure high availability, zero-downtime migration, and cost-effective cloud operations.";
  } else if (/ecommerce|e-commerce|store|shop|retail|commerce/i.test(lower)) {
    personalizedIntro =
      "Building a scalable digital commerce platform? F13 Technologies specializes in omnichannel architectures, headless commerce, and secure payment integrations designed for conversion and growth.";
  } else if (
    /automate|process|operations|workflow|efficiency|streamline/i.test(lower)
  ) {
    personalizedIntro =
      "Seeking to optimize business operations and automate workflows? F13 Technologies provides Process Consulting to eliminate operational bottlenecks and accelerate digital transformation.";
  }

  return {
    relevant: true,
    personalizedIntro,
    services: matchedServices.map((service) => ({
      name: service.name,
      icon: service.icon,
      description: service.description,
      relevanceReason: `Provides tailored ${service.name.toLowerCase()} capabilities designed specifically to address your requirement.`,
      url: service.url,
    })),
    whyF13: [
      `Proven domain expertise in ${matchedServices[0]?.name || "enterprise technology"} and modern architectures.`,
      "Tailored engineering and consulting aligned with your specific business requirements.",
      "End-to-end partner: bridging strategic business advisory with hands-on technical execution.",
      "Experience delivering scalable, secure solutions across diverse industry environments.",
    ],
    businessValue: [
      "Enhanced operational agility and reduced technological complexity.",
      "Improved enterprise security posture and proactive risk mitigation.",
      "Scalable infrastructure engineered to adapt to future business growth.",
    ],
    cta: {
      discussUrl: F13_COMPANY_INFO.discussUrl,
      exploreUrl: F13_COMPANY_INFO.servicesUrl,
    },
  };
}

/**
 * Helper to strip the f13-recommendation code block from raw markdown if needed
 */
export function stripF13RecommendationBlock(text: string): {
  cleanText: string;
  recommendationBlock: string | null;
} {
  const match = text.match(/```f13-recommendation([\s\S]*?)```/);
  if (!match) {
    return { cleanText: text, recommendationBlock: null };
  }

  const cleanText = text
    .replace(/```f13-recommendation[\s\S]*?```/g, "")
    .trimEnd();
  return {
    cleanText,
    recommendationBlock: match[1]?.trim() || null,
  };
}
