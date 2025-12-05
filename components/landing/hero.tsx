import { ArrowDown, ArrowRight, Rss, Sparkles } from "lucide-react";
import CTAButtons from "../buttons/CTAButtons";
import { Badge } from "../ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to gray-50 dark:from-black dark:to-gray-950 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Sparkles className="mr-2 size-4" />
          </Badge>

          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-7xl">
            Generate Professional Newsletters in{" "}
            <span className="bg-linear-to-r from-cyan-700 to-gray-600 bg-clip-text text-transparent">
              Minutes, Not Hours
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-800 sm:text-xl">
            Stop spending hours curating content. Let AI transform your RSS
            feeds into engaging newsletters with perfect titles, subject lines,
            and content.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButtons />
          </div>

          {/* Social Proof */}
          <div className="mt-8 text-sm text-gray-500  dark:text-gray-500">
            Join 1,000+ newsletter creators saving 5+ hours every week ·
            Starting at $9/month
          </div>

          {/* Hero visual - RSS Feeds → Newsletter Transformation */}
          <div className="relative mx-auto mt-16 max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Left Size - RSS Feed Orbs */}
              <div className="relative max-w-6xl mx-auto mt-16">
                <div className="grid grid-cols-3 gap-2 lg:gap-6 max-w-xs mx-auto lg:max-w-none">
                  {/* RSS Feed Orb 1 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-16 lg:size-24 rounded-full bg-linear-to-br from-cyan-500 to-gray-600 shadow-lg flex items-center justify-center animate-pulse">
                      <Rss className="size-6 lg:size-10 text-white" />
                    </div>
                    <span className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
                      Feed 1
                    </span>
                  </div>

                  {/* Rss Feed Orb 2 */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="relative size-16 lg:size-24 rounded-full bg-linear-to-br from-cyan-500 to-gray-600 shadow-lg flex items-center justify-center animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <Rss className="size-6 lg:size-10 text-white" />
                    </div>
                    <span className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
                      Feed 2
                    </span>
                  </div>

                  {/* Rss Feed Orb 3 */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="relative size-16 lg:size-24 rounded-full bg-linear-to-br from-cyan-500 to-gray-600 shadow-lg flex items-center justify-center animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <Rss className="size-6 lg:size-10 text-white" />
                    </div>
                    <span className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
                      Feed 3
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle - Arrows & AI Badge */}
              <div className="flex flex-col items-center gap-4 lg:my-0">
                {/* Mobile: Vertical arrows pointing down */}
                <div className="flex flex-col items-center gap-2 lg:hidden">
                  <ArrowDown className="size-6 text-blue-600 dark:text-blue-400 animate-bounce" />
                </div>

                {/* Desktop: Horizontal arrows pointing right */}
                <div className="hidden lg:flex lg:flex-col items-center gap-2">
                  <ArrowRight className="size-10 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                  <ArrowRight
                    className="size-10 text-teal-600 dark:text-cyan-400 animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <ArrowRight
                    className="size-10 text-blue-600 dark:text-cyan-400 animate-pulse"
                    style={{ animationDelay: "0.6s" }}
                  />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-500 to-gray-500 shadow-lg rounded-full">
                  <Sparkles className="size-4 text-white" />
                  <span className="text-xs font-semibold text-white">
                    AI Processing
                  </span>
                </div>
              </div>

              {/* Right side - Consolidated Newsletter */}
              <div className="flex-1 w-full">
                <div className="border-2 border-cyan-600 dark:border-cyan-700 rounded-xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                  {/* Newsletter header */}
                  <div className="bg-linear-to-r from-cyan-600 to-teal-600 px-6 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="size-4 text-white" />
                      <span className="text-xs font-medium text-white/80">
                        Your Newsletter
                      </span>
                    </div>
                    <div className="h-4 w-3/4 bg-white/90 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-white/70 rounded" />
                  </div>

                  {/* Newsletter Content */}
                  <div className="p-6 space-y-4">
                    {/* Titles */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-1.5 bg-cyan-600 rounded-full" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          5 Titles
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-gray-200 dark:bg-gray-800 h-2 w-full rounded" />
                        <div className="bg-gray-200 dark:bg-gray-800 h-2 w-5/6 rounded" />
                      </div>
                    </div>

                    {/* Body */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-1.5 rounded-full bg-teal-600" />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          Full Body
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800" />
                        <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800" />
                        <div className="h-2 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                      </div>
                    </div>

                    {/* Top 5 */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border border-gray-200 dark:border-gray-800 p-2 bg-cyan-50 dark:bg-cyan-950/30 rounded">
                        <div className="bg-cyan-300 dark:bg-cyan-700/50 h-2 w-3/4 rounded" />
                      </div>
                      <div className="border border-gray-200 dark:border-gray-800 p-2 bg-teal-50 dark:bg-teal-950/30 rounded">
                        <div className="bg-teal-300/50 dark:bg-teal-700/50 h-2 w-3/4 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
