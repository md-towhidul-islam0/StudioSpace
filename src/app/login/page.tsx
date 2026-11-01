"use client";

import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import Toast, { type ToastData } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

const inputClassName =
  "w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

/** Reads the `?redirect=` query param (if any) so we can send the user back after login. */
function getDesiredRoute(): string {
  if (typeof window === "undefined") return "/";
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  // Only allow same-origin paths to avoid open-redirect issues.
  return redirect?.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/";
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (type: ToastData["type"], message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    if (!data.email || !data.password) {
      const message = "Please fill in both email and password.";
      setError(message);
      showToast("error", message);
      return;
    }

    setIsLoading(true);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        const message = signInError.message || "Invalid email or password.";
        setError(message);
        showToast("error", message);
        return;
      }

      showToast("success", "Logged in successfully!");
      router.push(getDesiredRoute());
    } catch {
      const message = "Something went wrong. Please try again.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      const { error: googleError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: getDesiredRoute(),
      });

      if (googleError) {
        const message = googleError.message || "Google sign-in failed.";
        setError(message);
        showToast("error", message);
      }
    } catch {
      const message = "Something went wrong with Google sign-in.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-b from-orange-50 to-background px-4 py-12 dark:from-orange-950/30">
      {toast && (
        <Toast key={toast.id} toast={toast} onDismiss={() => setToast(null)} />
      )}

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Log in to find and book the perfect studio.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    "info",
                    "Password reset is not available yet. Please contact support.",
                  )
                }
                className="text-sm text-orange-500 transition hover:text-orange-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">OR</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleSignInButton
          onClick={handleGoogleLogin}
          loading={isGoogleLoading}
        />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-orange-500 transition hover:text-orange-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
