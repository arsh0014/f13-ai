"use client";

import React, { useState } from "react";
import {
  SquarePen,
  Search,
  LayoutGrid,
  ListFilter,
  PanelLeftClose,
  ExternalLink,
} from "lucide-react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { ThreadListPrimitive } from "@assistant-ui/react";
import { ThreadListItems } from "@/components/assistant-ui/elements/thread-list.aui";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThreadListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <>
      <Sidebar
        {...props}
        className="border-r border-[#1a1a1a] bg-black text-[#F1F3F4] transition-[width] duration-300 ease-out select-none"
      >
        {/* ==================================================================
            COLLAPSED ICON RAIL
            ================================================================== */}
        {isCollapsed ? (
          <div className="flex h-full w-full flex-col items-center justify-between py-3.5">
            {/* Top Logo & Navigation Icons */}
            <div className="flex flex-col items-center gap-2.5">
              {/* Logo */}
              <TooltipIconButton
                tooltip="F13 Technologies"
                side="right"
                onClick={toggleSidebar}
                className="size-9 p-0 hover:bg-transparent"
                aria-label="Expand sidebar"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/f13-icon.png"
                  alt="F13 Technologies"
                  className="size-8 rounded-lg object-contain transition-transform hover:scale-105"
                />
              </TooltipIconButton>

              {/* New Chat Button (Pen in Circle) */}
              <ThreadListPrimitive.New
                render={
                  <TooltipIconButton
                    tooltip="New chat"
                    side="right"
                    className="size-10 rounded-full bg-[#121212] text-[#F1F3F4] transition-colors hover:bg-[#1f1f1f]"
                    aria-label="New chat"
                  />
                }
              >
                <SquarePen className="size-5 stroke-[1.8] text-[#F1F3F4]" />
              </ThreadListPrimitive.New>

              {/* Search */}
              <TooltipIconButton
                tooltip="Search"
                side="right"
                onClick={toggleSidebar}
                className="size-10 rounded-full text-[#C4C7C5] transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Search"
              >
                <Search className="size-5 stroke-[1.8]" />
              </TooltipIconButton>

              {/* Library */}
              <TooltipIconButton
                tooltip="Library"
                side="right"
                onClick={() => setLibraryOpen(true)}
                className="size-10 rounded-full text-[#C4C7C5] transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Library"
              >
                <LayoutGrid className="size-5 stroke-[1.8]" />
              </TooltipIconButton>
            </div>
          </div>
        ) : (
          /* ==================================================================
             EXPANDED SIDEBAR NAVBAR
             ================================================================== */
          <div className="flex h-full w-full flex-col justify-between">
            {/* Top Section */}
            <div className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
              {/* Header: F13 Logo + Search & Collapse Toggle */}
              <div className="flex items-center justify-between pb-3.5">
                <a
                  href="https://www.f13.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-opacity hover:opacity-90"
                  aria-label="F13 Technologies"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/f13-logo-dark.png"
                    alt="F13 Technologies"
                    className="h-6.5 w-auto object-contain"
                  />
                </a>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setIsSearchActive((prev) => !prev)}
                    className="flex size-8 items-center justify-center rounded-full text-[#C4C7C5] transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
                    aria-label="Search threads"
                  >
                    <Search className="size-4 stroke-[1.8]" />
                  </button>
                  <button
                    onClick={toggleSidebar}
                    className="flex size-8 items-center justify-center rounded-full text-[#C4C7C5] transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
                    aria-label="Collapse menu"
                    title="Collapse menu"
                  >
                    <PanelLeftClose className="size-4.5 stroke-[1.8]" />
                  </button>
                </div>
              </div>

              {/* New Chat Button */}
              <div className="mb-3">
                <ThreadListPrimitive.New
                  render={
                    <button className="flex w-full items-center gap-3 rounded-2xl bg-[#121212] px-4 py-3 text-sm font-medium text-[#F1F3F4] transition-colors hover:bg-[#1f1f1f] focus:outline-none">
                      <SquarePen className="size-4.5 stroke-[1.8] text-[#F1F3F4]" />
                      <span>New chat</span>
                    </button>
                  }
                />
              </div>

              {/* Quick Navigation Links */}
              <div className="space-y-0.5">
                <button
                  onClick={() => setLibraryOpen(true)}
                  className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2 text-sm text-[#C4C7C5] transition-colors hover:bg-white/5 hover:text-[#F1F3F4] focus:outline-none"
                >
                  <LayoutGrid className="size-4.5 stroke-[1.8] text-[#C4C7C5]" />
                  <span>Library</span>
                </button>
              </div>

              {/* Recent Chats Section ("All") */}
              <div className="mt-4 flex flex-1 flex-col pt-1">
                <div className="flex items-center justify-between px-3 pb-1">
                  <span className="text-xs font-medium text-[#A7ADB2]">
                    All
                  </span>
                  <button
                    onClick={() => setIsSearchActive((p) => !p)}
                    className="text-[#A7ADB2] transition-colors hover:text-[#F1F3F4]"
                    aria-label="Filter threads"
                  >
                    <ListFilter className="size-4 stroke-[1.8]" />
                  </button>
                </div>

                {/* Optional Search Bar inside All */}
                {isSearchActive && (
                  <div className="animate-in fade-in px-1 py-1.5 duration-200">
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search recent chats..."
                      className="h-8 rounded-full border-[#222222] bg-[#111111] text-xs text-[#F1F3F4] placeholder:text-[#A7ADB2] focus-visible:border-[#179A9D]"
                      autoFocus
                    />
                  </div>
                )}

                {/* List of Recent Threads */}
                <div className="mt-1 flex-1 overflow-y-auto">
                  <ThreadListItems searchQuery={searchQuery} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Sidebar>

      {/* ==================================================================
          LIBRARY & SOLUTIONS MODAL
          ================================================================== */}
      <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-[#1f1f1f] bg-black p-6 text-[#F1F3F4] shadow-2xl">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#179A9D] text-white">
                <LayoutGrid className="size-4.5" />
              </div>
              <DialogTitle className="text-lg font-bold text-[#F1F3F4]">
                F13 Enterprise Library
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-[#A7ADB2]">
              Explore official F13 Technologies solutions and consulting
              capabilities.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
            <a
              href="https://www.f13.tech/services/consulting/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-xl border border-[#1f1f1f] bg-[#080808] p-3 transition-colors hover:border-[#179A9D] hover:bg-[#179A9D]/10"
            >
              <span className="font-semibold text-[#F1F3F4]">
                Cloud Consulting
              </span>
              <span className="text-[11px] text-[#A7ADB2]">
                Migration, Architecture &amp; DevOps
              </span>
            </a>

            <a
              href="https://www.f13.tech/services/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-xl border border-[#1f1f1f] bg-[#080808] p-3 transition-colors hover:border-[#179A9D] hover:bg-[#179A9D]/10"
            >
              <span className="font-semibold text-[#F1F3F4]">
                AI &amp; Analytics
              </span>
              <span className="text-[11px] text-[#A7ADB2]">
                Machine Learning, LLMs &amp; BI
              </span>
            </a>

            <a
              href="https://www.f13.tech/services/network-security/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-xl border border-[#1f1f1f] bg-[#080808] p-3 transition-colors hover:border-[#179A9D] hover:bg-[#179A9D]/10"
            >
              <span className="font-semibold text-[#F1F3F4]">
                Cyber Risk Advisory
              </span>
              <span className="text-[11px] text-[#A7ADB2]">
                Zero Trust, SASE &amp; Auditing
              </span>
            </a>

            <a
              href="https://www.f13.tech/services/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-xl border border-[#1f1f1f] bg-[#080808] p-3 transition-colors hover:border-[#179A9D] hover:bg-[#179A9D]/10"
            >
              <span className="font-semibold text-[#F1F3F4]">
                Learning &amp; Upskilling
              </span>
              <span className="text-[11px] text-[#A7ADB2]">
                Corporate Training &amp; Workshops
              </span>
            </a>
          </div>

          <div className="mt-4 flex justify-end">
            <a
              href="https://www.f13.tech/services/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-[#222222] bg-[#111111] text-xs text-[#F1F3F4] hover:border-[#179A9D] hover:bg-[#179A9D]/15 hover:text-[#5FB7BB]",
              )}
            >
              <ExternalLink className="mr-1.5 size-3.5 text-[#179A9D]" />
              Explore All Services on f13.tech
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
