"use client";

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Camera,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  DollarSign,
  Eye,
  Film,
  Image as ImageIcon,
  Info,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Mic,
  Music,
  Palette,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sliders,
  Sparkles,
  User,
  Users,
  Volume2,
  Wifi,
  Wind,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import Toast, { type ToastData } from "@/components/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

type FormState = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  detailedOverview: string;
};

const CATEGORIES = [
  {
    id: "Photo Studio",
    label: "Photo Studio",
    icon: Camera,
    desc: "Cyclorama walls, strobe lighting, backdrop setups",
  },
  {
    id: "Film Stage",
    label: "Film Stage",
    icon: Film,
    desc: "Soundstages, green screen, production facilities",
  },
  {
    id: "Podcast Lounge",
    label: "Podcast Lounge",
    icon: Mic,
    desc: "Acoustic lounge, multi-mic rigs, video podcasting",
  },
  {
    id: "Music Suite",
    label: "Music Suite",
    icon: Music,
    desc: "Recording booth, instrument room, DAW consoles",
  },
  {
    id: "Workshop",
    label: "Workshop",
    icon: Building2,
    desc: "Creative maker space, craft tables, masterclasses",
  },
  {
    id: "Dance Studio",
    label: "Dance Studio",
    icon: Sparkles,
    desc: "Sprung hardwood floor, mirrored walls, sound system",
  },
  {
    id: "Art Gallery & Loft",
    label: "Art Gallery & Loft",
    icon: Palette,
    desc: "Sunlit open loft, exhibition rails, high ceilings",
  },
] as const;

const PRESET_AMENITIES = [
  { id: "High-Speed Wi-Fi", label: "High-Speed Wi-Fi", icon: Wifi },
  {
    id: "Professional Lighting",
    label: "Professional Lighting",
    icon: Sparkles,
  },
  {
    id: "Cyclorama / Green Screen",
    label: "Cyclorama / Green Screen",
    icon: Layers,
  },
  { id: "Soundproofing", label: "Soundproofing", icon: Volume2 },
  { id: "Air Conditioning", label: "Air Conditioning", icon: Wind },
  {
    id: "Dressing & Makeup Station",
    label: "Dressing & Makeup Station",
    icon: Sparkles,
  },
  { id: "Private Restroom", label: "Private Restroom", icon: CheckCircle2 },
  { id: "Free On-Site Parking", label: "Free On-Site Parking", icon: Car },
  { id: "Kitchenette & Coffee", label: "Kitchenette & Coffee", icon: Coffee },
  {
    id: "Props & Backdrop Racks",
    label: "Props & Backdrop Racks",
    icon: Palette,
  },
  { id: "Audio Monitors / PA", label: "Audio Monitors / PA", icon: Music },
  { id: "24/7 Access", label: "24/7 Access", icon: Clock },
  { id: "Blackout Curtains", label: "Blackout Curtains", icon: Sliders },
  { id: "Freight Elevator", label: "Freight Elevator", icon: ArrowLeft },
] as const;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";

const toFormState = (data: Listing): FormState => ({
  title: data.title ?? "",
  category: data.category || CATEGORIES[0].id,
  hourlyRate: String(data.hourlyRate ?? 75),
  securityDeposit: String(data.securityDeposit ?? 100),
  maxCapacity: String(data.maxCapacity ?? 10),
  location: data.location ?? "",
  imageUrl: data.imageUrl ?? "",
  amenities: Array.isArray(data.amenities) ? data.amenities : [],
  detailedOverview: data.detailedOverview ?? "",
});

const EditStudioForm = ({ listingId }: { listingId: string }) => {
  const router = useRouter();

  const [original, setOriginal] = useState<Listing | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<ToastData | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<"form" | "preview">(
    "form",
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const showToast = (type: ToastData["type"], message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // Load the previous listing data so every field starts pre-filled
  useEffect(() => {
    let cancelled = false;

    const loadListing = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`${apiUrl}/allstudio/d/${listingId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data: Listing = await res.json();
        if (!data || !data._id) throw new Error("Listing not found");
        if (cancelled) return;
        setOriginal(data);
        setForm(toFormState(data));
      } catch (err) {
        console.error("Error loading listing:", err);
        if (!cancelled) {
          setLoadError(
            "We couldn't load this listing. It may have been removed.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadListing();
    return () => {
      cancelled = true;
    };
  }, [listingId, apiUrl]);

  const toggleAmenity = (name: string) => {
    if (!form) return;
    setField(
      "amenities",
      form.amenities.includes(name)
        ? form.amenities.filter((item) => item !== name)
        : [...form.amenities, name],
    );
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (!trimmed || !form) return;
    if (form.amenities.includes(trimmed)) {
      showToast("info", `"${trimmed}" is already added.`);
      setCustomAmenityInput("");
      return;
    }
    setField("amenities", [...form.amenities, trimmed]);
    setCustomAmenityInput("");
    showToast("success", `Added "${trimmed}" to amenities.`);
  };

  // Restore every field back to the previous (saved) data
  const handleResetForm = () => {
    if (!original) return;
    setForm(toFormState(original));
    setFormError("");
    showToast("info", "Changes reverted to the saved listing.");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form || !original) return;
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Please enter a studio title.");
      showToast("error", "Studio title is required.");
      return;
    }
    if (!form.location.trim()) {
      setFormError("Please provide a location / address.");
      showToast("error", "Location / address is required.");
      return;
    }
    if (!form.hourlyRate || Number(form.hourlyRate) <= 0) {
      setFormError("Please enter a valid hourly rate.");
      showToast("error", "Hourly rate must be greater than $0.");
      return;
    }
    if (
      !form.detailedOverview.trim() ||
      form.detailedOverview.trim().length < 20
    ) {
      setFormError(
        "Please provide a detailed overview (at least 20 characters).",
      );
      showToast("error", "Detailed overview must be at least 20 characters.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit) || 0,
      maxCapacity: Number(form.maxCapacity) || 1,
      location: form.location.trim(),
      imageUrl: form.imageUrl.trim(),
      amenities: form.amenities,
      detailedOverview: form.detailedOverview.trim(),
      // Keep the original author + creation date untouched
      userEmail: original.userEmail,
      userName: original.userName,
    };

    try {
      const res = await fetch(`${apiUrl}/allstudio/d/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      showToast("success", "Your listing has been updated!");
      router.push("/my-listing");
    } catch (err) {
      console.error("Error updating listing:", err);
      setFormError("Failed to save your changes. Please try again.");
      showToast("error", "Could not update the listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------- Loading --------------------------------- */
  if (loading) {
    return (
      <div className="mx-auto w-[92%] max-w-7xl py-8 md:py-12">
        <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-40 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------- Error ---------------------------------- */
  if (loadError || !form || !original) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-[92%] max-w-xl flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Listing not found
        </h1>
        <p className="text-sm text-muted-foreground">
          {loadError ?? "This listing doesn't exist or was already deleted."}
        </p>
        <Link
          href="/my-listing"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Listings
        </Link>
      </div>
    );
  }

  const activeCategory =
    CATEGORIES.find((c) => c.id === form.category) ?? CATEGORIES[0];
  const CategoryIcon = activeCategory.icon;

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-gradient-to-b from-orange-50/50 via-background to-background dark:from-orange-950/20 dark:via-background dark:to-background">
      {toast && (
        <Toast key={toast.id} toast={toast} onDismiss={() => setToast(null)} />
      )}

      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-[92%] max-w-7xl py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400">
              <Link href="/" className="transition hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/my-listing" className="transition hover:underline">
                My Listings
              </Link>
              <span>/</span>
              <span className="text-muted-foreground">Edit Studio</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Edit Studio Listing
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                Editing
              </span>
            </div>

            <p className="max-w-2xl text-sm text-muted-foreground">
              Update pricing, amenities, media, or the description. Your
              previous data is loaded as the default in every field.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
              title="Revert to the saved listing data"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Revert
            </button>

            <div className="flex rounded-lg border border-border bg-muted/60 p-0.5 lg:hidden">
              <button
                type="button"
                onClick={() => setActivePreviewTab("form")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activePreviewTab === "form"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Edit Form
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab("preview")}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activePreviewTab === "preview"
                    ? "bg-background text-orange-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Form error banner */}
        {formError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Could not save your changes</p>
              <p className="text-xs text-red-600 dark:text-red-400">
                {formError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormError("")}
              className="rounded p-1 text-red-600 transition hover:bg-red-100 dark:hover:bg-red-900/50"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ------------------------------ Form column ------------------------------ */}
          <div
            className={`lg:col-span-7 ${
              activePreviewTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Host information (read-only) */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Host Information</h2>
                      <p className="text-xs text-muted-foreground">
                        Original owner of this listing
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Lock className="h-3 w-3 text-orange-500" />
                    Read-only
                  </span>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/30 p-4 sm:flex-row sm:items-center">
                  <Avatar className="h-14 w-14 border border-border">
                    <AvatarImage src={undefined} alt={original.userName} />
                    <AvatarFallback className="bg-orange-500/20 font-bold text-orange-600 dark:text-orange-400">
                      {original.userName
                        ? original.userName.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label
                        htmlFor="host-name"
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
                      >
                        <User className="h-3.5 w-3.5" />
                        Host Name
                      </label>
                      <input
                        id="host-name"
                        type="text"
                        value={original.userName}
                        readOnly
                        disabled
                        className="w-full cursor-not-allowed rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground opacity-90 select-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="host-email"
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Host Email
                      </label>
                      <input
                        id="host-email"
                        type="email"
                        value={original.userEmail}
                        readOnly
                        disabled
                        className="w-full cursor-not-allowed rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground opacity-90 select-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  <span>
                    Author and creation date stay the same when you save.
                  </span>
                </div>
              </div>

              {/* Title & category */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">
                      Studio Overview & Category
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Update the name and primary category of your studio
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="studio-title"
                        className="text-xs font-bold text-foreground"
                      >
                        Studio Title <span className="text-orange-500">*</span>
                      </label>
                      <span className="text-[11px] text-muted-foreground">
                        {form.title.length}/100
                      </span>
                    </div>
                    <input
                      id="studio-title"
                      name="title"
                      type="text"
                      required
                      maxLength={100}
                      placeholder="e.g. Sunset Daylight Loft & Cyclorama Wall"
                      value={form.title}
                      onChange={(e) => setField("title", e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="studio-category"
                      className="text-xs font-bold text-foreground"
                    >
                      Category <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="studio-category"
                        name="category"
                        value={form.category}
                        onChange={(e) => setField("category", e.target.value)}
                        className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label} — {cat.desc}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2">
                        <CategoryIcon className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = form.category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setField("category", cat.id)}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                              isSelected
                                ? "border-orange-500 bg-orange-500/10 text-orange-600 shadow-xs dark:text-orange-400"
                                : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            }`}
                          >
                            <Icon
                              className={`h-3.5 w-3.5 ${
                                isSelected
                                  ? "text-orange-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & capacity */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Rates & Capacity</h2>
                    <p className="text-xs text-muted-foreground">
                      Adjust hourly pricing, refundable deposit, and capacity
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="hourly-rate"
                      className="text-xs font-bold text-foreground"
                    >
                      Hourly Rate ($) <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-bold text-muted-foreground">
                        $
                      </span>
                      <input
                        id="hourly-rate"
                        name="hourlyRate"
                        type="number"
                        min="1"
                        max="10000"
                        step="1"
                        required
                        value={form.hourlyRate}
                        onChange={(e) => setField("hourlyRate", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-14 pl-8 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        / hr
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="security-deposit"
                      className="text-xs font-bold text-foreground"
                    >
                      Security Deposit ($)
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-bold text-muted-foreground">
                        $
                      </span>
                      <input
                        id="security-deposit"
                        name="securityDeposit"
                        type="number"
                        min="0"
                        max="20000"
                        step="10"
                        value={form.securityDeposit}
                        onChange={(e) =>
                          setField("securityDeposit", e.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-12 pl-8 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        USD
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="max-capacity"
                      className="text-xs font-bold text-foreground"
                    >
                      Max Capacity <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="max-capacity"
                        name="maxCapacity"
                        type="number"
                        min="1"
                        max="500"
                        required
                        value={form.maxCapacity}
                        onChange={(e) =>
                          setField("maxCapacity", e.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-14 pl-10 text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        people
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Location & Address</h2>
                    <p className="text-xs text-muted-foreground">
                      Where your studio is located
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="studio-location"
                    className="text-xs font-bold text-foreground"
                  >
                    Studio Address / Location{" "}
                    <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="studio-location"
                      name="location"
                      type="text"
                      required
                      placeholder="e.g. 120 Franklin St, Studio 4B, Brooklyn, NY 11222"
                      value={form.location}
                      onChange={(e) => setField("location", e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2.5 pr-4 pl-10 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Info className="h-3.5 w-3.5 text-orange-500" />
                    <span>
                      The exact suite or buzzer code can also be shared
                      privately with confirmed bookings.
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover image */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">
                      Studio Media & Image URL
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Replace the cover photo of your listing
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="image-url"
                      className="text-xs font-bold text-foreground"
                    >
                      Cover Image URL
                    </label>
                    <div className="relative">
                      <ImageIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="image-url"
                        name="imageUrl"
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={form.imageUrl}
                        onChange={(e) => setField("imageUrl", e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-4 pl-10 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>

                  {form.imageUrl && (
                    <div className="overflow-hidden rounded-xl border border-border bg-muted/40 p-2">
                      <div className="flex items-center justify-between px-1 pb-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Image Preview
                        </span>
                        <button
                          type="button"
                          onClick={() => setField("imageUrl", "")}
                          className="text-xs text-muted-foreground hover:text-red-500"
                        >
                          Remove image
                        </button>
                      </div>
                      <div className="h-44 w-full overflow-hidden rounded-lg bg-black/10">
                        {/* biome-ignore lint/performance/noImgElement: Dynamic user-provided image URL */}
                        <img
                          src={form.imageUrl}
                          alt="Studio preview"
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">
                        Amenities & Equipment
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Keep, remove, or add amenities included in the rate
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                    {form.amenities.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {PRESET_AMENITIES.map((amenity) => {
                    const Icon = amenity.icon;
                    const isChecked = form.amenities.includes(amenity.label);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.label)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                          isChecked
                            ? "border-orange-500 bg-orange-500/5 shadow-xs dark:bg-orange-500/10"
                            : "border-border bg-background hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-md ${
                              isChecked
                                ? "bg-orange-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span
                            className={`text-xs ${
                              isChecked
                                ? "font-semibold text-foreground"
                                : "font-medium text-muted-foreground"
                            }`}
                          >
                            {amenity.label}
                          </span>
                        </div>
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                            isChecked
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-muted-foreground/30 bg-card"
                          }`}
                        >
                          {isChecked && (
                            <Check className="h-3 w-3 stroke-[3]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom amenities */}
                <div className="mt-5 rounded-xl border border-dashed border-border p-3.5">
                  <label
                    htmlFor="custom-amenity"
                    className="block text-xs font-semibold text-muted-foreground"
                  >
                    Add Custom Amenity or Feature:
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="custom-amenity"
                      type="text"
                      placeholder="e.g. Fog Machine, Soundboard, Teleprompter..."
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomAmenity();
                        }
                      }}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Tag
                    </button>
                  </div>

                  {form.amenities.some(
                    (a) => !PRESET_AMENITIES.some((pa) => pa.label === a),
                  ) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        Custom tags:
                      </span>
                      {form.amenities
                        .filter(
                          (a) => !PRESET_AMENITIES.some((pa) => pa.label === a),
                        )
                        .map((custom) => (
                          <span
                            key={custom}
                            className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-medium text-orange-600 dark:text-orange-400"
                          >
                            {custom}
                            <button
                              type="button"
                              onClick={() => toggleAmenity(custom)}
                              aria-label={`Remove ${custom}`}
                              className="text-orange-500 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed overview */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">
                        Detailed Studio Overview
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Dimensions, lighting, gear list & house rules
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {form.detailedOverview.length} chars
                  </span>
                </div>

                <textarea
                  id="detailed-overview"
                  name="detailedOverview"
                  required
                  rows={6}
                  placeholder="Describe your studio space..."
                  value={form.detailedOverview}
                  onChange={(e) => setField("detailedOverview", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-4 text-sm font-medium leading-relaxed outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Clear, transparent descriptions receive up to 3x more
                  confirmed bookings.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Revert Changes
                  </button>
                  <Link
                    href="/my-listing"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground transition hover:bg-muted sm:w-auto"
                  >
                    Cancel
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ----------------------------- Preview column ----------------------------- */}
          <div
            className={`lg:col-span-5 ${
              activePreviewTab === "form" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="sticky top-20 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Live Marketplace Preview
                  </span>
                </div>
                <span className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  What Renters See
                </span>
              </div>

              <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:border-orange-500/40">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {form.imageUrl ? (
                    /* biome-ignore lint/performance/noImgElement: Dynamic user-provided image URL */
                    <img
                      src={form.imageUrl}
                      alt={form.title || "Studio preview"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/80 to-muted text-muted-foreground">
                      <ImageIcon className="h-10 w-10 stroke-1 opacity-50" />
                      <span className="text-xs font-medium">
                        Add an Image URL to preview cover
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <CategoryIcon className="h-3.5 w-3.5 text-orange-400" />
                    <span>{form.category || "Studio"}</span>
                  </div>

                  <div className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
                    ${form.hourlyRate || 0}{" "}
                    <span className="text-[10px] font-normal opacity-90">
                      / hr
                    </span>
                  </div>

                  {Number(form.securityDeposit) > 0 && (
                    <div className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/90">
                      ${form.securityDeposit} deposit
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <h3 className="line-clamp-1 text-lg font-bold transition-colors group-hover:text-orange-500">
                    {form.title || "Untitled Studio Space"}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                    <span className="line-clamp-1">
                      {form.location || "Location not specified yet"}
                    </span>
                  </div>

                  <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {form.detailedOverview || "No overview added yet."}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-orange-500" />
                    Up to {form.maxCapacity || 0} guests
                  </div>

                  {form.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {form.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {amenity}
                        </span>
                      ))}
                      {form.amenities.length > 4 && (
                        <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-orange-500">
                          +{form.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/my-listing"
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition hover:border-orange-500 hover:text-orange-500"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to My Listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudioForm;
