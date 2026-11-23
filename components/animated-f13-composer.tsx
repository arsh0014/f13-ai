"use client";

import React, { FC, useState, useMemo } from "react";
import { ComposerPrimitive, useAuiState, AuiIf } from "@assistant-ui/react";
import { PlusIcon, MicIcon, ArrowUpIcon, SquareIcon } from "lucide-react";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { ComposerAttachments } from "@/components/assistant-ui/elements/attachment.aui";
import { cn } from "@/lib/utils";

export type ComposerState = "idle" | "focused" | "typing" | "generating";

interface AnimatedF13ComposerProps {
  autoFocus?: boolean;
  stateOverride?: ComposerState;
  isCompact?: boolean;
}

export const AnimatedF13Composer: FC<AnimatedF13ComposerProps> = ({
  autoFocus = false,
  stateOverride,
  isCompact: compactProp,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Assistant UI state hooks
  const isRunning = useAuiState((s) => s.thread.isRunning);
  const isThreadEmpty = useAuiState((s) => s.thread.messages.length === 0);
  const composerText = useAuiState((s) => s.composer.text || "");
  const canSend = useAuiState((s) => s.composer.canSend);
  const isDictationSupported = useAuiState(
    (s) => s.thread.capabilities.dictation,
  );
  const isSending = useAuiState(
    (s) =>
      s.composer.submission !== undefined &&
      !(s.thread.isRunning && s.thread.capabilities.cancel),
  );

  // Derive active state
  const hasText = composerText.trim().length > 0;
  const activeState: ComposerState = useMemo(() => {
    if (stateOverride) return stateOverride;
    if (isRunning) return "generating";
    if (isFocused && hasText) return "typing";
    if (isFocused) return "focused";
    return "idle";
  }, [stateOverride, isRunning, isFocused, hasText]);

  const isCompact = compactProp ?? !isThreadEmpty;

  return (
    <div
      data-state={activeState}
      data-compact={isCompact}
      className={cn(
        "relative mx-auto w-full transition-all duration-500 ease-out",
        isCompact ? "max-w-3xl" : "max-w-2xl",
      )}
    >
      {/* ====================================================================
          TURQUOISE AURORA GLOW SYSTEM (BEHIND PILL COMPOSER)
          ==================================================================== */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-x-4 -top-2 -bottom-3 z-0 overflow-visible rounded-full transition-opacity duration-700 ease-out select-none",
          activeState === "idle" && (isCompact ? "opacity-35" : "opacity-65"),
          activeState === "focused" &&
            (isCompact ? "opacity-75" : "opacity-95"),
          activeState === "typing" &&
            (isCompact ? "opacity-90" : "opacity-100"),
          activeState === "generating" && "opacity-30",
        )}
      >
        {/* Layer 1: Wide Ambient Deep Glow */}
        <div
          className="f13-aurora-layer-ambient absolute inset-0 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 30% 85%, rgba(23, 154, 157, 0.40) 0%, transparent 65%), " +
              "radial-gradient(ellipse at 70% 85%, rgba(95, 183, 187, 0.35) 0%, transparent 65%), " +
              "radial-gradient(ellipse at 50% 95%, rgba(33, 166, 168, 0.30) 0%, transparent 70%)",
          }}
        />

        {/* Layer 2: Flowing Primary Aurora Ribbon (Wave 1) */}
        <div
          className={cn(
            "f13-aurora-layer-wave1 absolute -inset-x-2 bottom-0 h-10 rounded-full blur-xl transition-transform duration-500",
            activeState === "focused" && "scale-y-110",
            activeState === "typing" && "scale-y-115 brightness-110",
          )}
          style={{
            background:
              "linear-gradient(90deg, " +
              "rgba(23, 154, 157, 0.1) 0%, " +
              "rgba(95, 183, 187, 0.45) 25%, " +
              "rgba(33, 166, 168, 0.55) 50%, " +
              "rgba(23, 154, 157, 0.45) 75%, " +
              "rgba(95, 183, 187, 0.15) 100%)",
            backgroundSize: "200% 100%",
          }}
        />

        {/* Layer 3: Organic Secondary Aurora Counter-Wave (Wave 2) */}
        <div
          className={cn(
            "f13-aurora-layer-wave2 absolute -inset-x-3 bottom-0.5 h-8 rounded-full blur-lg transition-transform duration-500",
            activeState === "focused" && "scale-x-105",
            activeState === "typing" && "scale-x-105 contrast-125",
          )}
          style={{
            background:
              "linear-gradient(90deg, " +
              "rgba(33, 166, 168, 0.15) 0%, " +
              "rgba(23, 154, 157, 0.45) 30%, " +
              "rgba(95, 183, 187, 0.55) 65%, " +
              "rgba(33, 166, 168, 0.15) 100%)",
            backgroundSize: "200% 100%",
          }}
        />

        {/* Layer 4: Specular Edge Shimmer */}
        <div
          className="f13-aurora-layer-shimmer absolute inset-x-2 bottom-0 h-1.5 rounded-full blur-sm"
          style={{
            background:
              "linear-gradient(90deg, " +
              "transparent 0%, " +
              "rgba(95, 183, 187, 0.75) 50%, " +
              "transparent 100%)",
          }}
        />
      </div>

      {/* ====================================================================
          GEMINI PILL COMPOSER (CLEAN PILL CAPSULE)
          ==================================================================== */}
      <ComposerPrimitive.Root className="relative z-10 flex w-full flex-col">
        {/* Optional attachments container if user uploaded files */}
        <div className="mb-2 px-3 empty:hidden">
          <ComposerAttachments />
        </div>

        <ComposerPrimitive.AttachmentDropzone
          render={
            <div
              data-slot="f13_composer-shell"
              className={cn(
                "group relative flex min-h-[56px] w-full cursor-text items-center rounded-full border bg-black px-3.5 py-1.5 transition-all duration-300",
                "border-[#222222] hover:border-[#179A9D]/40",
                isFocused &&
                  "border-[#179A9D] shadow-[0_0_22px_rgba(23,154,157,0.22)]",
                "data-[dragging=true]:border-dashed data-[dragging=true]:border-[#5FB7BB] data-[dragging=true]:bg-[#0d0d0d]",
              )}
            />
          }
        >
          {/* LEFT ICON: Plus (+) Button for Attachments */}
          <ComposerPrimitive.AddAttachment
            render={
              <TooltipIconButton
                tooltip="Add files or images"
                side="top"
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 rounded-full text-[#C4C7C5] transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Add attachment"
              />
            }
          >
            <PlusIcon className="size-5.5 stroke-[1.8]" />
          </ComposerPrimitive.AddAttachment>

          {/* CENTER: Main Text Input */}
          <ComposerPrimitive.Input
            className="flex-1 resize-none overflow-y-auto border-none bg-transparent px-2.5 py-2 text-[15px] leading-normal font-normal text-[#F1F3F4] caret-[#179A9D] outline-none placeholder:text-[#8E918F] sm:text-base"
            rows={1}
            autoFocus={autoFocus}
            enterKeyHint="send"
            aria-label="Input search prompt"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* RIGHT ACTIONS: Microphone Icon + Send Button */}
          <div className="flex shrink-0 items-center gap-1 pl-1">
            {/* Microphone Icon (🎤) */}
            {isDictationSupported ? (
              <>
                <AuiIf condition={(s) => s.composer.dictation == null}>
                  <ComposerPrimitive.Dictate
                    render={
                      <TooltipIconButton
                        tooltip="Use microphone"
                        side="top"
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 shrink-0 rounded-full text-[#C4C7C5] transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Use microphone"
                      />
                    }
                  >
                    <MicIcon className="size-5 stroke-[1.8]" />
                  </ComposerPrimitive.Dictate>
                </AuiIf>
                <AuiIf condition={(s) => s.composer.dictation != null}>
                  <ComposerPrimitive.StopDictation
                    render={
                      <TooltipIconButton
                        tooltip="Stop listening"
                        side="top"
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 shrink-0 rounded-full bg-[#179A9D] text-white hover:bg-[#5FB7BB]"
                        aria-label="Stop listening"
                      />
                    }
                  >
                    <SquareIcon className="size-3.5 fill-current" />
                  </ComposerPrimitive.StopDictation>
                </AuiIf>
              </>
            ) : (
              <TooltipIconButton
                tooltip="Use microphone"
                side="top"
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 rounded-full text-[#C4C7C5] transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Use microphone"
              >
                <MicIcon className="size-5 stroke-[1.8]" />
              </TooltipIconButton>
            )}

            {/* Send / Stop Generation Button */}
            {isRunning || isSending ? (
              <ComposerPrimitive.Cancel
                render={
                  <TooltipIconButton
                    tooltip="Stop generation"
                    side="top"
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 rounded-full border border-[#222222] bg-[#111111] text-[#F1F3F4] transition-all hover:bg-[#1f1f1f]"
                    aria-label="Stop generation"
                  />
                }
              >
                <SquareIcon className="size-3.5 fill-current text-[#179A9D]" />
              </ComposerPrimitive.Cancel>
            ) : hasText ? (
              <ComposerPrimitive.Send
                render={
                  <TooltipIconButton
                    tooltip="Send"
                    side="top"
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-9 shrink-0 rounded-full transition-all duration-200",
                      canSend
                        ? "bg-[#179A9D] text-white shadow-[0_0_12px_rgba(23,154,157,0.4)] hover:bg-[#5FB7BB]"
                        : "cursor-not-allowed bg-[#111111] text-[#A7ADB2]/40",
                    )}
                    aria-label="Send"
                  />
                }
              >
                <ArrowUpIcon className="size-4 stroke-[2.5]" />
              </ComposerPrimitive.Send>
            ) : null}
          </div>
        </ComposerPrimitive.AttachmentDropzone>
      </ComposerPrimitive.Root>
    </div>
  );
};
