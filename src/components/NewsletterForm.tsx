"use client";

import { Check, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    // No backend for the newsletter yet — just confirm the signup in the UI.
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <form onSubmit={handleNewsletterSubmit} className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-9 text-sm outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Subscribe
        </button>
      </div>
      {subscribed && (
        <output className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          You&apos;re subscribed — welcome aboard!
        </output>
      )}
    </form>
  );
}
