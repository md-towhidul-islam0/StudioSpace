"use client";

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Camera,
  Compass,
  Film,
  ImageIcon,
  type LucideIcon,
  MapPin,
  Mic,
  Music,
  Palette,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Toast, { type ToastData } from "@/components/Toast";
import { getTokenFromClient } from "./getTokenByClient";

type Listing = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  detailedOverview: string;
  userEmail: string;
  userName: string;
  createdAt: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";

const getCategoryIcon = (category: string): LucideIcon => {
  const norm = (category || "").toLowerCase().trim();
  if (norm.includes("photo") || norm.includes("camera")) return Camera;
  if (norm.includes("film") || norm.includes("video") || norm.includes("stage"))
    return Film;
  if (norm.includes("podcast")) return Mic;
  if (
    norm.includes("music") ||
    norm.includes("audio") ||
    norm.includes("sound")
  )
    return Music;
  if (norm.includes("art") || norm.includes("gallery") || norm.includes("loft"))
    return Palette;
  if (norm.includes("dance")) return Sparkles;
  if (norm.includes("work") || norm.includes("craft") || norm.includes("maker"))
    return Building2;
  return Compass;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MylistingCard = ({ Email }: { Email: string | undefined }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [tokenValue, setTokenValue] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  const toastIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ;

  const pushToast = (type: ToastData["type"], message: string) => {
    toastIdRef.current += 1;
    const toast: ToastData = { id: toastIdRef.current, type, message };
    setToasts((prev) => [...prev, toast]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
// useEffect(() => {
//   const loadToken = async () => {
//     try {
//       const token = await getTokenFromClient();
//       setTokenValue(token ?? null);
//     } catch (error) {
//       console.error("Token Error:", error);
//     } finally {
//       setTokenLoading(false);
//     }
//   };

//   loadToken();
// }, []);

  const loadListings = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${apiUrl}/allstudio/e/${encodeURIComponent(Email ?? "")}`,
        { cache: "no-store", signal: controller.signal,
          // headers:{
          //   authorization: `Bearer ${tokenValue}`
          // }
        },
      );
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const result = await res.json();
      setListings(Array.isArray(result) ? result : []);
      setLoading(false);
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("Error fetching my listings:", err);
      setError("Could not load your listings. Please try again later.");
      setLoading(false);
    }
  }, [Email, apiUrl]);

  useEffect(() => {
    if (!Email) {
      setListings([]);
      setLoading(false);
      return;
    }
    loadListings();
    return () => controllerRef.current?.abort();
  }, [Email, loadListings]);

  // Close the delete dialog with the Escape key
  useEffect(() => {
    if (!deleteTarget || deleting) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeleteTarget(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteTarget, deleting]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiUrl}/allstudio/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const deletedTitle = deleteTarget.title;
      setListings((prev) => prev.filter((v) => v._id !== deleteTarget._id));
      pushToast("success", `"${deletedTitle}" has been deleted.`);
    } catch (err) {
      console.error("Error deleting listing:", err);
      pushToast("error", "Could not delete this listing. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <section className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto my-10 md:my-14">
      {/* Section Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Listings
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your studio spaces — edit details or remove a listing.
          </p>
        </div>

        {!loading && !error && listings.length > 0 && (
          <span className="self-start rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-500">
            {listings.length} {listings.length === 1 ? "listing" : "listings"}
          </span>
        )}

        <Link
          href="/add-studio"
          className="group/add inline-flex items-center gap-2 self-start rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/25 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 transition-transform duration-200 group-hover/add:rotate-90" />
          <span>Add Studio</span>
        </Link>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex animate-pulse flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row"
            >
              <div className="h-44 w-full rounded-xl bg-muted sm:h-40 sm:w-64" />
              <div className="flex flex-1 flex-col gap-3 py-2">
                <div className="h-4 w-2/5 rounded-md bg-muted" />
                <div className="h-3 w-1/3 rounded-md bg-muted" />
                <div className="h-3 w-full rounded-md bg-muted" />
                <div className="h-3 w-3/4 rounded-md bg-muted" />
              </div>
              <div className="flex gap-2 sm:w-28 sm:flex-col">
                <div className="h-9 flex-1 rounded-xl bg-muted" />
                <div className="h-9 flex-1 rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="text-sm font-medium text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => loadListings()}
            className="mt-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-orange-500 hover:text-orange-500"
          >
            Retry
          </button>
        </div>
      ) : !Email ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            Sign in to see and manage your listings.
          </p>
          <Link
            href="/login"
            className="mt-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Sign In
          </Link>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            You haven&apos;t published any studios yet.
          </p>
          <Link
            href="/add-studio"
            className="mt-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        /* One card per row */
        <div className="flex flex-col gap-5">
          {listings.map((v) => {
            const CategoryIcon = getCategoryIcon(v.category);
            return (
              <article
                key={v._id}
                className="group flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 sm:flex-row sm:items-stretch"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-auto sm:w-64 lg:w-72">
                  {/* biome-ignore lint/performance/noImgElement: Dynamic user studio image URL with dynamic fallback */}
                  <img
                    src={v.imageUrl || FALLBACK_IMAGE}
                    alt={v.title || "Studio preview"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/15">
                    <CategoryIcon className="h-3.5 w-3.5 text-orange-400" />
                    <span className="line-clamp-1">
                      {v.category || "Studio"}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md">
                    ${v.hourlyRate || 0}{" "}
                    <span className="font-normal opacity-90">/ hr</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover:text-orange-500">
                        {v.title || "Untitled Studio Space"}
                      </h3>
                      <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Added {formatDate(v.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                      <span className="line-clamp-1">
                        {v.location || "Location not specified yet"}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {v.detailedOverview || "No overview added yet."}
                    </p>

                    {v.amenities && v.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {v.amenities.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                        {v.amenities.length > 4 && (
                          <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-orange-500">
                            +{v.amenities.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick stats */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Wallet className="h-3.5 w-3.5 text-orange-500" />$
                      {v.securityDeposit || 0} deposit
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="h-3.5 w-3.5 text-orange-500" />
                      Up to {v.maxCapacity || 0} guests
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <CalendarDays className="h-3.5 w-3.5 text-orange-500" />
                      {formatDate(v.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-row gap-2 border-t border-border/60 pt-3 sm:w-32 sm:flex-col sm:justify-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                  <Link
                    href={`/explore-studio/edit/${v._id}`}
                    aria-label={`Edit ${v.title}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 hover:text-white active:scale-[0.98] sm:flex-none"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(v)}
                    aria-label={`Delete ${v.title}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2.5 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-[0.98] sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => {
              if (!deleting) setDeleteTarget(null);
            }}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <h3
              id="delete-dialog-title"
              className="mt-4 text-lg font-bold text-foreground"
            >
              Delete this listing?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                {deleteTarget.title}
              </span>{" "}
              will be permanently removed. This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
                {!deleting && <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </section>
  );
};

export default MylistingCard;
