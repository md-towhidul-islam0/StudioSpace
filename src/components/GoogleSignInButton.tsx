"use client";

import { Loader2 } from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M21.35 11.1H12v2.9h5.35c-.5 2.5-2.6 3.9-5.35 3.9a5.9 5.9 0 1 1 0-11.8c1.5 0 2.85.55 3.9 1.45l2.15-2.15A8.9 8.9 0 1 0 12 20.9c4.65 0 8.85-3.35 8.85-9 0-.25-.02-.5-.05-.8z" />
    </svg>
  );
}

type GoogleSignInButtonProps = {
  onClick: () => void;
  loading?: boolean;
  label?: string;
};

export default function GoogleSignInButton({
  onClick,
  loading = false,
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <GoogleIcon className="h-4 w-4 text-[#4285F4]" />
      )}
      {label}
    </button>
  );
}
