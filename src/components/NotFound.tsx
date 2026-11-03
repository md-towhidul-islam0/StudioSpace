"use client";

import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type NotFoundLink = {
  href: string;
  label: string;
};

type NotFoundProps = {
  /** Big ghost code rendered behind the content, e.g. "404". */
  code?: string;
  title?: string;
  description?: string;
  /** Primary call-to-action button (solid orange). */
  primaryAction?: NotFoundLink;
  /** Optional secondary button rendered as an outline. */
  secondaryAction?: NotFoundLink;
  /** Quick-link chips rendered under a divider. */
  links?: NotFoundLink[];
  /** Render the "Go back" button (uses browser history, falls back to Home). */
  showBackButton?: boolean;
  /** Reduce vertical height when embedded inside an existing page. */
  compact?: boolean;
};

const DEFAULT_PRIMARY: NotFoundLink = { href: "/", label: "Back to Home" };

export default function NotFound({
  code = "404",
  title = "Page not found",
  description = "The page you're looking for doesn't exist — it may have been moved, deleted, or the link is broken. Let's get you back to a studio that does exist.",
  primaryAction = DEFAULT_PRIMARY,
  secondaryAction,
  links,
  showBackButton = true,
  compact = false,
}: NotFoundProps) {
  const router = useRouter();

  const handleBack = () => {
    // history.length is 1 (or less) when the user landed here directly
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(primaryAction.href);
  };

  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden px-4 ${
        compact ? "min-h-[55vh] py-12" : "min-h-[75vh] py-20"
      }`}
      aria-labelledby="not-found-title"
    >
      {/* Decorative background: dot grid + orange glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#f9731614_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="relative w-full max-w-xl text-center">
        {/* Ghost code behind the badge */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-6 select-none text-[7rem] leading-none font-extrabold tracking-tighter text-orange-500/[0.07] sm:text-[10rem]"
        >
          {code}
        </span>

        {/* Icon badge */}
        <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-500/20 bg-orange-500/10 shadow-lg shadow-orange-500/10">
          <Compass className="h-9 w-9 text-orange-500" aria-hidden="true" />
          <span className="absolute -right-2.5 -top-2.5 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-background bg-orange-500 px-1.5 text-[11px] font-extrabold text-white shadow-md">
            {code}
          </span>
        </div>

        <h1
          id="not-found-title"
          className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </h1>
        <p className="mx-auto mt-3.5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Go back
            </button>
          )}
          <Link
            href={primaryAction.href}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/25 transition-all hover:bg-orange-600 active:scale-[0.98]"
          >
            {primaryAction.label}
          </Link>
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-orange-500/50 hover:text-orange-500 active:scale-[0.98]"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>

        {/* Quick links */}
        {links && links.length > 0 && (
          <div className="mt-10 border-t border-border/70 pt-6">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Or try one of these
            </p>
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:border-orange-500/50 hover:text-orange-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
