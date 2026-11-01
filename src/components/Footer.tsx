// Server component: the only interactive part (the newsletter form) lives in
// NewsletterForm. The year is read inside a cached function — reading the
// clock directly would block static prerendering under cacheComponents.

import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import NewsletterForm from "./NewsletterForm";
import Navlogo from "./ui/image/logoNav.png";

async function getCopyrightYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/", label: "Explore Studios" },
  { href: "/", label: "How It Works" },
  { href: "/", label: "About Us" },
  { href: "/login", label: "Login" },
  { href: "/signin", label: "Register" },
];

const studioCategories = [
  { href: "/", label: "Photography Studios" },
  { href: "/", label: "Film & Video Studios" },
  { href: "/", label: "Recording Studios" },
  { href: "/", label: "Podcast Studios" },
  { href: "/", label: "Dance Studios" },
  { href: "/", label: "Rehearsal Rooms" },
];

type BrandIcon = "x" | "facebook" | "instagram" | "linkedin" | "youtube";

const socialLinks: { href: string; label: string; icon: BrandIcon }[] = [
  // The new X logo (formerly Twitter) — deliberately not the old bird.
  { href: "https://x.com", label: "StudioSpace on X", icon: "x" },
  {
    href: "https://facebook.com",
    label: "StudioSpace on Facebook",
    icon: "facebook",
  },
  {
    href: "https://instagram.com",
    label: "StudioSpace on Instagram",
    icon: "instagram",
  },
  {
    href: "https://linkedin.com",
    label: "StudioSpace on LinkedIn",
    icon: "linkedin",
  },
  {
    href: "https://youtube.com",
    label: "StudioSpace on YouTube",
    icon: "youtube",
  },
];

// Brand marks as inline SVGs — lucide-react v1 no longer ships brand icons.
const BRAND_PATHS: Record<BrandIcon, string> = {
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z",
  facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

function BrandIcon({
  name,
  className,
}: {
  name: BrandIcon;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="rounded-lg border border-border p-2.5 text-muted-foreground transition hover:border-orange-500 hover:text-orange-500"
    >
      {children}
    </a>
  );
}

const sectionHeadingClass =
  "text-sm font-semibold uppercase tracking-wider text-foreground";
const footerLinkClass =
  "text-sm text-muted-foreground transition hover:text-orange-500";

export default async function Footer() {
  const year = await getCopyrightYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto w-[85%] px-0 py-12 md:w-[70%]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + mission */}
          <div className="space-y-4">
            <Image
              src={Navlogo}
              alt="StudioSpace logo"
              width={140}
              height={56}
              className="h-auto w-32"
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              StudioSpace connects creators with bookable studios — photography,
              film, recording, podcast, and more — all by the hour, wherever you
              are.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <SocialLink
                  key={social.label}
                  href={social.href}
                  label={social.label}
                >
                  <BrandIcon name={social.icon} className="h-4 w-4" />
                </SocialLink>
              ))}
            </div>
          </div>

          {/* Quick navigation */}
          <nav aria-label="Quick links" className="space-y-4">
            <h2 className={sectionHeadingClass}>Quick Links</h2>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular categories */}
          <nav aria-label="Popular studio categories" className="space-y-4">
            <h2 className={sectionHeadingClass}>Popular Categories</h2>
            <ul className="space-y-2.5">
              {studioCategories.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="space-y-4">
            <h2 className={sectionHeadingClass}>Stay in the loop</h2>
            <p className="text-sm text-muted-foreground">
              Get new studios, deals and booking tips straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Copyright & terms */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} StudioSpace. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link href="/" className="transition hover:text-orange-500">
              Terms of Service
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/" className="transition hover:text-orange-500">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/" className="transition hover:text-orange-500">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
