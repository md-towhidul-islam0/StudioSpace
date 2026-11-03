"use client";

import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import Toast, { type ToastData } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

const inputClassName =
  "w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

const PASSWORD_RULES = [
  {
    id: "uppercase",
    label: "Must have an uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "Must have a lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: "length",
    label: "Length must be at least 6 characters",
    test: (value: string) => value.length >= 6,
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();

  // Password state drives the live validation checklist below the input.
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const passwordRules = useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        ...rule,
        passed: rule.test(password),
      })),
    [password],
  );
  const isPasswordValid = passwordRules.every((rule) => rule.passed);

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

    if (!data.name || !data.email || !data.password) {
      const message = "Please fill in name, email and password.";
      setError(message);
      showToast("error", message);
      return;
    }

    // Block registration and show the error in the form for invalid passwords.
    if (!isPasswordValid) {
      const failedRules = passwordRules
        .filter((rule) => !rule.passed)
        .map((rule) => rule.label)
        .join(", ");
      const message = `Password is invalid: ${failedRules}.`;
      setError(message);
      showToast("error", message);
      return;
    }

    setIsLoading(true);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.photoURL || undefined,
      });

      if (signUpError) {
        const message = signUpError.message || "Registration failed.";
        setError(message);
        showToast("error", message);
        return;
      }

      showToast("success", "Account created! Redirecting to login...");
      await authClient.signOut();

      router.push("/login");
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
        callbackURL: "/",
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
          <h1 className="text-2xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Register to start booking studios by the hour.
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
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <div className="relative">
              <User
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                className={inputClassName}
              />
            </div>
          </div>

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
            <label htmlFor="photo-url" className="text-sm font-medium">
              Photo URL{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <input
                id="photo-url"
                name="photoURL"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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

            <ul className="mt-2 space-y-1">
              {passwordRules.map((rule) => (
                <li
                  key={rule.id}
                  className={`flex items-center gap-1.5 text-xs ${
                    rule.passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Register
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-orange-500 transition hover:text-orange-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
