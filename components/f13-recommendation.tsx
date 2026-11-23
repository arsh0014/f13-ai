"use client";

import React, { useMemo, useState } from "react";
import {
  Cloud,
  Sparkles,
  ShieldCheck,
  Lock,
  Workflow,
  ShoppingCart,
  GraduationCap,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Building2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  parseF13Recommendation,
  type F13RecommendationData,
} from "@/lib/f13-matcher";

interface F13RecommendationProps {
  rawJson?: string;
  data?: F13RecommendationData;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud: Cloud,
  Sparkles: Sparkles,
  ShieldCheck: ShieldCheck,
  Lock: Lock,
  Workflow: Workflow,
  ShoppingCart: ShoppingCart,
  GraduationCap: GraduationCap,
};

export const F13RecommendationCard: React.FC<F13RecommendationProps> = ({
  rawJson,
  data: directData,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const data = useMemo(() => {
    if (directData) return directData;
    if (rawJson) return parseF13Recommendation(rawJson);
    return null;
  }, [directData, rawJson]);

  // If data is not yet valid JSON (e.g. still streaming) or not relevant, do not display
  if (!data || !data.relevant || !data.services || data.services.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="How F13 Technologies Can Help You"
      className="not-prose relative my-5 w-full overflow-hidden rounded-2xl border border-[#222222] bg-black p-4 text-[#F1F3F4] shadow-xl transition-all duration-300 sm:p-5"
    >
      {/* Ambient Top-Right Turquoise Shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(23,154,157,0.2),transparent_70%)] blur-2xl select-none"
      />

      {/* Header Bar with Branding & Expand/Collapse Toggle */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#1f1f1f] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#179A9D] text-white shadow-[0_0_10px_rgba(23,154,157,0.4)]">
            <Building2 className="size-4" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#5FB7BB] uppercase">
              F13 Technologies Consulting Advisory
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-[#179A9D]/40 bg-[#179A9D]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#5FB7BB]">
            <Sparkles className="size-3 text-[#179A9D]" />
            Tailored Capabilities
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-lg border border-[#222222] bg-[#0d0d0d] px-2 py-1 text-xs text-[#A7ADB2] transition-colors hover:border-[#179A9D] hover:text-[#5FB7BB]"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            <span className="text-[11px]">
              {isExpanded ? "Minimize" : "Expand"}
            </span>
            {isExpanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="relative z-10 mt-3.5 space-y-1">
        <h3 className="text-base font-bold tracking-tight text-[#F1F3F4] sm:text-lg">
          How F13 Technologies Can Help You
        </h3>
        <p className="text-xs font-normal text-[#A7ADB2] sm:text-sm">
          Let&apos;s turn your technological challenges into business
          opportunities.
        </p>
      </div>

      {/* Collapsible Content Body */}
      {isExpanded && (
        <div className="animate-in fade-in-50 relative z-10 mt-4 space-y-5 duration-200">
          {/* A. Personalized Introduction */}
          {data.personalizedIntro && (
            <div className="rounded-xl border border-l-4 border-[#1f1f1f] border-[#179A9D] bg-[#080808] p-3.5 text-xs leading-relaxed font-normal text-[#F1F3F4] sm:text-sm">
              <p>{data.personalizedIntro}</p>
            </div>
          )}

          {/* B. Recommended F13 Services */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold tracking-wider text-[#A7ADB2] uppercase">
              Recommended Capabilities
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {data.services.map((service, index) => {
                const IconComponent = ICON_MAP[service.icon] || Cloud;
                return (
                  <div
                    key={index}
                    className="group flex flex-col justify-between rounded-xl border border-[#1f1f1f] bg-[#080808] p-3.5 transition-all duration-200 hover:border-[#179A9D] hover:bg-[#111111] hover:shadow-[0_0_12px_rgba(23,154,157,0.15)]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#179A9D]/15 text-[#179A9D] transition-colors duration-200 group-hover:bg-[#179A9D] group-hover:text-white">
                            <IconComponent className="size-4" />
                          </div>
                          <span className="text-xs font-semibold text-[#F1F3F4] transition-colors group-hover:text-[#5FB7BB] sm:text-sm">
                            {service.name}
                          </span>
                        </div>
                        {service.url && (
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1 text-[#A7ADB2] hover:text-[#5FB7BB]"
                            title={`Explore ${service.name}`}
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </div>
                      {service.description && (
                        <p className="mt-2 text-xs leading-relaxed text-[#A7ADB2]">
                          {service.description}
                        </p>
                      )}
                    </div>

                    {service.relevanceReason && (
                      <div className="mt-3 rounded-lg border border-[#179A9D]/20 bg-[#179A9D]/10 px-2.5 py-1.5 text-[11px] leading-tight text-[#F1F3F4]/90">
                        <span className="font-semibold text-[#5FB7BB]">
                          How it fits:{" "}
                        </span>
                        {service.relevanceReason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* C & D: Why F13 & Business Value */}
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {/* C. Why Consider F13 */}
            {data.whyF13 && data.whyF13.length > 0 && (
              <div className="space-y-2 rounded-xl border border-[#1f1f1f] bg-[#080808] p-3.5">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#F1F3F4] uppercase">
                  <CheckCircle2 className="size-3.5 text-[#179A9D]" />
                  Why Consider F13?
                </h4>
                <ul className="space-y-1.5 text-xs text-[#A7ADB2]">
                  {data.whyF13.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#179A9D]">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* D. Business Value */}
            {data.businessValue && data.businessValue.length > 0 && (
              <div className="space-y-2 rounded-xl border border-[#1f1f1f] bg-[#080808] p-3.5">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#F1F3F4] uppercase">
                  <TrendingUp className="size-3.5 text-[#179A9D]" />
                  Potential Business Value
                </h4>
                <ul className="space-y-1.5 text-xs text-[#A7ADB2]">
                  {data.businessValue.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#179A9D]">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* E. Call to Action Buttons */}
          <div className="flex flex-col items-stretch gap-2.5 border-t border-[#1f1f1f] pt-3 sm:flex-row sm:items-center">
            <a
              href={data.cta?.discussUrl || "https://www.f13.tech/contact-us/"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "h-9 cursor-pointer justify-center gap-1.5 rounded-xl bg-[#179A9D] px-4 text-xs font-medium text-white shadow-[0_0_12px_rgba(23,154,157,0.3)] transition-all hover:bg-[#5FB7BB]",
              )}
            >
              <span>Discuss Your Project with F13</span>
              <ArrowUpRight className="size-3.5" />
            </a>

            <a
              href={data.cta?.exploreUrl || "https://www.f13.tech/services/"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 cursor-pointer justify-center gap-1.5 rounded-xl border-[#222222] bg-[#111111] px-4 text-xs font-medium text-[#F1F3F4] transition-colors hover:border-[#179A9D] hover:bg-[#1a1a1a] hover:text-[#5FB7BB]",
              )}
            >
              <span>Explore F13 Services</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </aside>
  );
};
