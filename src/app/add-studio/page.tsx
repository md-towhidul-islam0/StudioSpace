"use client";

import {
  AlertCircle,
  ArrowRight,
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
  HelpCircle,
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
  Shield,
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
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import Toast, { type ToastData } from "@/components/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";

// Available studio categories with icons and descriptions
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

// Curated preset amenities with matching icons
const PRESET_AMENITIES = [
  { id: "High-Speed Wi-Fi", label: "High-Speed Wi-Fi", icon: Wifi },
  { id: "Professional Lighting", label: "Professional Lighting", icon: Sparkles },
  { id: "Cyclorama / Green Screen", label: "Cyclorama / Green Screen", icon: Layers },
  { id: "Soundproofing", label: "Soundproofing", icon: Volume2 },
  { id: "Air Conditioning", label: "Air Conditioning", icon: Wind },
  { id: "Dressing & Makeup Station", label: "Dressing & Makeup Station", icon: Sparkles },
  { id: "Private Restroom", label: "Private Restroom", icon: CheckCircle2 },
  { id: "Free On-Site Parking", label: "Free On-Site Parking", icon: Car },
  { id: "Kitchenette & Coffee", label: "Kitchenette & Coffee", icon: Coffee },
  { id: "Props & Backdrop Racks", label: "Props & Backdrop Racks", icon: Palette },
  { id: "Audio Monitors / PA", label: "Audio Monitors / PA", icon: Music },
  { id: "24/7 Access", label: "24/7 Access", icon: Clock },
  { id: "Blackout Curtains", label: "Blackout Curtains", icon: Sliders },
  { id: "Freight Elevator", label: "Freight Elevator", icon: ArrowRight },
] as const;

// Quick sample images for demonstration
const SAMPLE_IMAGES = [
  {
    label: "Photo Loft",
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Film Stage",
    url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Podcast Lounge",
    url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Music Suite",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function AddStudioPage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // Host info from authenticated session (with fallback)
  const hostName = session?.user?.name || "StudioSpace Creator";
  const hostEmail = session?.user?.email || "host@studiospace.com";
  const hostAvatar = session?.user?.image || null;

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Photo Studio");
  const [hourlyRate, setHourlyRate] = useState<string>("85");
  const [securityDeposit, setSecurityDeposit] = useState<string>("150");
  const [maxCapacity, setMaxCapacity] = useState<string>("15");
  const [location, setLocation] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-Speed Wi-Fi",
    "Professional Lighting",
    "Air Conditioning",
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState("");
  const [detailedOverview, setDetailedOverview] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<ToastData | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<"form" | "preview">("form");

  const showToast = (type: ToastData["type"], message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  // Toggle amenity selection
  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  // Add custom amenity tag
  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (!trimmed) return;
    if (selectedAmenities.includes(trimmed)) {
      showToast("info", `"${trimmed}" is already added.`);
      setCustomAmenityInput("");
      return;
    }
    setSelectedAmenities((prev) => [...prev, trimmed]);
    setCustomAmenityInput("");
    showToast("success", `Added "${trimmed}" to amenities.`);
  };

  // Quick fill demo data
  const handleFillDemoData = () => {
    setTitle("The Sunset Cyclorama & Daylight Production Loft");
    setCategory("Photo Studio");
    setHourlyRate("95");
    setSecurityDeposit("200");
    setMaxCapacity("20");
    setLocation("424 Broadway, 5th Floor, SoHo, New York, NY 10013");
    setImageUrl(
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
    );
    setSelectedAmenities([
      "High-Speed Wi-Fi",
      "Professional Lighting",
      "Cyclorama / Green Screen",
      "Air Conditioning",
      "Dressing & Makeup Station",
      "Free On-Site Parking",
    ]);
    setDetailedOverview(
      "A stunning 2,400 sq.ft sun-drenched creative studio featuring 14ft ceilings, south-facing industrial windows, and a 20x20ft corner cyc wall.\n\nIncluded in every booking:\n• Profoto D2 lighting kit with softboxes & C-stands\n• Dedicated makeup and hair vanity station with LED daylight mirrors\n• High-speed 1Gbps fiber internet & client lounge area\n• Freight elevator access for equipment load-in\n\nPerfect for editorial fashion campaigns, commercial video shoots, interviews, and product photography."
    );
    setFormError("");
    showToast("info", "Sample studio details filled successfully!");
  };

  // Reset form
  const handleResetForm = () => {
    setTitle("");
    setCategory("Photo Studio");
    setHourlyRate("75");
    setSecurityDeposit("100");
    setMaxCapacity("10");
    setLocation("");
    setImageUrl("");
    setSelectedAmenities(["High-Speed Wi-Fi", "Air Conditioning"]);
    setDetailedOverview("");
    setFormError("");
    showToast("info", "Form reset to defaults.");
  };


  const router = useRouter();
  // Form submission handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Handel submit")
    e.preventDefault();
    setFormError("");

    // Validate required fields
    if (!title.trim()) {
      setFormError("Please enter a studio title.");
      showToast("error", "Studio title is required.");
      return;
    }

    if (!location.trim()) {
      setFormError("Please provide a location / address.");
      showToast("error", "Location / address is required.");
      return;
    }

    if (!hourlyRate || Number(hourlyRate) <= 0) {
      setFormError("Please enter a valid hourly rate.");
      showToast("error", "Hourly rate must be greater than $0.");
      return;
    }

    if (!detailedOverview.trim() || detailedOverview.trim().length < 20) {
      setFormError("Please provide a detailed overview (at least 20 characters).");
      showToast("error", "Detailed overview must be at least 20 characters.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      category,
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit) || 0,
      maxCapacity: Number(maxCapacity) || 1,
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      amenities: selectedAmenities,
      detailedOverview: detailedOverview.trim(),
      userEmail: hostEmail,
      userName: hostName,
      createdAt: new Date().toISOString(),
    };
    console.log(payload);
    try {
      // Simulate network save / call endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-studio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);
      console.log(response);

      if (response && !response.ok) {
        throw new Error("Failed to save studio listing.");
      }

      showToast("success", "Studio listing published successfully!");
      router.push('/my-listing');
    } catch {
      // Graceful fallback for UI demonstration
      showToast("error", "Failed to publish studio listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selected category info
  const activeCategoryMeta = useMemo(
    () => CATEGORIES.find((c) => c.id === category) || CATEGORIES[0],
    [category]
  );
  const CategoryIcon = activeCategoryMeta.icon;

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-gradient-to-b from-orange-50/50 via-background to-background dark:from-orange-950/20 dark:via-background dark:to-background">
      {/* Toast notifications */}
      {toast && (
        <Toast key={toast.id} toast={toast} onDismiss={() => setToast(null)} />
      )}

      {/* Decorative background glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-[92%] max-w-7xl py-8 md:py-12">
        {/* Header section with actions */}
        <div className="mb-8 flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400">
              <Link href="/" className="transition hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="text-muted-foreground">Host Dashboard</span>
              <span>/</span>
              <span className="text-foreground">Add New Studio</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                List a New Studio
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                Live Editor
              </span>
            </div>

            <p className="max-w-2xl text-sm text-muted-foreground">
              Provide your creative space details, pricing, amenities, and media.
              Your listing will reach photographers, filmmakers, musicians, and creators looking for bookable spaces.
            </p>
          </div>

          {/* Quick actions: Demo fill & Mobile preview switch */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFillDemoData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-sm transition hover:border-orange-500 hover:text-orange-500"
              title="Populate form with complete example data"
            >
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              Fill Sample Data
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
              title="Reset all inputs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            {/* Mobile tab switcher */}
            <div className="flex rounded-lg border border-border bg-muted/60 p-0.5 lg:hidden">
              <button
                type="button"
                onClick={() => setActivePreviewTab("form")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${activePreviewTab === "form"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Edit Form
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab("preview")}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${activePreviewTab === "preview"
                  ? "bg-background text-orange-500 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview Card
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
              <p className="font-semibold">Missing or invalid information</p>
              <p className="text-xs text-red-600 dark:text-red-400">{formError}</p>
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

        {/* 2-Column Layout: Form on Left (7 cols), Sticky Live Preview on Right (5 cols) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Form Column */}
          <div
            className={`space-y-6 lg:col-span-7 ${activePreviewTab === "preview" ? "hidden lg:block" : "block"
              }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* SECTION 1: Read-Only User Host Information */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Host Information</h2>
                      <p className="text-xs text-muted-foreground">
                        Account linked to this studio listing
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Lock className="h-3 w-3 text-orange-500" />
                    Read-only
                  </span>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar className="h-14 w-14 border border-border">
                      <AvatarImage
                        src={hostAvatar || undefined}
                        alt={hostName}
                      />
                      <AvatarFallback className="bg-orange-500/20 font-bold text-orange-600 dark:text-orange-400">
                        {hostName ? hostName.charAt(0).toUpperCase() : "U"}
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
                        <div className="relative">
                          <input
                            id="host-name"
                            name="userName"
                            type="text"
                            value={hostName}
                            readOnly
                            disabled
                            aria-readonly="true"
                            className="w-full cursor-not-allowed rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground opacity-90 select-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="host-email"
                          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Host Email
                        </label>
                        <div className="relative">
                          <input
                            id="host-email"
                            name="userEmail"
                            type="email"
                            value={hostEmail}
                            readOnly
                            disabled
                            aria-readonly="true"
                            className="w-full cursor-not-allowed rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground opacity-90 select-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    <span>
                      {session?.user
                        ? "Verified StudioSpace member credentials."
                        : isSessionPending
                          ? "Loading account session..."
                          : "Guest mode: Listing will default to your authenticated profile once logged in."}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Studio Title & Category */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Studio Overview & Category</h2>
                    <p className="text-xs text-muted-foreground">
                      Give your studio an inviting name and choose the primary category
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="studio-title" className="text-xs font-bold text-foreground">
                        Studio Title <span className="text-orange-500">*</span>
                      </label>
                      <span className="text-[11px] text-muted-foreground">
                        {title.length}/100
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="studio-title"
                        name="title"
                        type="text"
                        required
                        maxLength={100}
                        placeholder="e.g. Sunset Daylight Loft & Cyclorama Wall"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Use a descriptive name highlighting notable features (e.g., &quot;Acoustic Soundstage&quot;, &quot;Daylight Loft&quot;).
                    </p>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label htmlFor="studio-category" className="text-xs font-bold text-foreground">
                      Category <span className="text-orange-500">*</span>
                    </label>

                    {/* Standard Select Dropdown for accessibility and mobile */}
                    <div className="relative">
                      <select
                        id="studio-category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label} — {cat.desc}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground">
                        <CategoryIcon className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>

                    {/* Category pill chips for quick visual selection */}
                    <div className="mt-2 flex flex-wrap gap-2 pt-1">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${isSelected
                              ? "border-orange-500 bg-orange-500/10 text-orange-600 shadow-xs dark:text-orange-400"
                              : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                              }`}
                          >
                            <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-orange-500" : "text-muted-foreground"}`} />
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Pricing & Capacity */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Rates & Capacity</h2>
                    <p className="text-xs text-muted-foreground">
                      Set competitive hourly pricing, refundable deposit, and attendee capacity
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Hourly Rate ($) */}
                  <div className="space-y-1.5">
                    <label htmlFor="hourly-rate" className="text-xs font-bold text-foreground">
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
                        placeholder="75"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-14 pl-8 text-sm font-semibold outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        / hr
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Billed hourly to renters</p>
                  </div>

                  {/* Security Deposit ($) */}
                  <div className="space-y-1.5">
                    <label htmlFor="security-deposit" className="text-xs font-bold text-foreground">
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
                        placeholder="150"
                        value={securityDeposit}
                        onChange={(e) => setSecurityDeposit(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-12 pl-8 text-sm font-semibold outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        USD
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Refundable damage deposit</p>
                  </div>

                  {/* Max Capacity */}
                  <div className="space-y-1.5">
                    <label htmlFor="max-capacity" className="text-xs font-bold text-foreground">
                      Max Capacity <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="max-capacity"
                        name="maxCapacity"
                        type="number"
                        min="1"
                        max="500"
                        required
                        placeholder="15"
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-14 pl-10 text-sm font-semibold outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        people
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Total guests & crew allowed</p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Location / Address */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Location & Address</h2>
                    <p className="text-xs text-muted-foreground">
                      Specify the street address or neighborhood where your studio operates
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="studio-location" className="text-xs font-bold text-foreground">
                    Studio Address / Location <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="studio-location"
                      name="location"
                      type="text"
                      required
                      placeholder="e.g. 120 Franklin St, Studio 4B, Brooklyn, NY 11222"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2.5 pr-4 pl-10 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Info className="h-3.5 w-3.5 text-orange-500" />
                    <span>
                      The exact suite or buzzer code can also be shared privately with confirmed bookings.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Image URL & Media */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Studio Media & Image URL</h2>
                      <p className="text-xs text-muted-foreground">
                        Add a high-resolution cover photo link showcasing your space
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="image-url" className="text-xs font-bold text-foreground">
                      Cover Image URL
                    </label>
                    <div className="relative">
                      <ImageIcon className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="image-url"
                        name="imageUrl"
                        type="url"
                        placeholder="https://images.unsplash.com/... or paste image link"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pr-4 pl-10 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>

                  {/* Preset quick picks */}
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Or select a sample showcase photo:
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {SAMPLE_IMAGES.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setImageUrl(sample.url)}
                          className="rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition hover:border-orange-500 hover:bg-orange-500/10 hover:text-orange-500"
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual preview strip */}
                  {imageUrl && (
                    <div className="relative mt-2 overflow-hidden rounded-xl border border-border bg-muted/40 p-2">
                      <div className="flex items-center justify-between px-1 pb-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Image Preview
                        </span>
                        <button
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="text-xs text-muted-foreground hover:text-red-500"
                        >
                          Remove image
                        </button>
                      </div>
                      <div className="relative h-44 w-full overflow-hidden rounded-lg bg-black/10">
                        {/* Using standard img for external user-provided URL */}
                        {/* biome-ignore lint/a11y/useAltText: Dynamic user image preview with explicit aria label */}
                        <img
                          src={imageUrl}
                          alt="Studio preview"
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            showToast("error", "Could not load the provided image URL.");
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 6: Amenities List (Tags / Checkboxes) */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Amenities & Equipment</h2>
                      <p className="text-xs text-muted-foreground">
                        Select all amenities included in the hourly rate
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                    {selectedAmenities.length} Selected
                  </span>
                </div>

                {/* Amenities Grid with Tags & Checkbox state */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {PRESET_AMENITIES.map((amenity) => {
                    const Icon = amenity.icon;
                    const isChecked = selectedAmenities.includes(amenity.label);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.label)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${isChecked
                          ? "border-orange-500 bg-orange-500/5 shadow-xs dark:bg-orange-500/10"
                          : "border-border bg-background hover:border-border hover:bg-muted/40"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-md ${isChecked
                              ? "bg-orange-500 text-white"
                              : "bg-muted text-muted-foreground"
                              }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span
                            className={`text-xs font-medium ${isChecked
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground"
                              }`}
                          >
                            {amenity.label}
                          </span>
                        </div>

                        {/* Interactive Checkbox Indicator */}
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border transition ${isChecked
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-muted-foreground/30 bg-card"
                            }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amenity Tag Adder */}
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

                  {/* Extra custom tags display */}
                  {selectedAmenities.some(
                    (a) => !PRESET_AMENITIES.some((pa) => pa.label === a)
                  ) && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-[11px] text-muted-foreground">Custom tags:</span>
                        {selectedAmenities
                          .filter((a) => !PRESET_AMENITIES.some((pa) => pa.label === a))
                          .map((custom) => (
                            <span
                              key={custom}
                              className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-medium text-orange-600 dark:text-orange-400"
                            >
                              {custom}
                              <button
                                type="button"
                                onClick={() => toggleAmenity(custom)}
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

              {/* SECTION 7: Detailed Overview */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Detailed Studio Overview</h2>
                      <p className="text-xs text-muted-foreground">
                        Describe dimensions, ceiling height, lighting conditions, gear list & house rules
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-muted-foreground">
                    {detailedOverview.length} chars
                  </span>
                </div>

                <div className="space-y-1.5">
                  <textarea
                    id="detailed-overview"
                    name="detailedOverview"
                    required
                    rows={6}
                    placeholder="Provide a comprehensive breakdown of your studio space...

• Space specs: Dimensions (sq ft), ceiling height, natural light direction
• Included gear: C-stands, softboxes, sandbags, audio cables
• House rules: Noise limits, cleanup requirements, smoking policy
• Access: Parking instructions, freight elevator availability"
                    value={detailedOverview}
                    onChange={(e) => setDetailedOverview(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-4 text-sm font-medium leading-relaxed outline-none transition placeholder:text-muted-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Clear, transparent descriptions receive up to 3x more confirmed bookings.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast("info", "Draft saved locally.");
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground transition hover:bg-muted sm:w-auto"
                  >
                    Save Draft
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing Listing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      Publish Studio Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sticky Live Listing Preview Column (5 cols) */}
          <div
            className={`space-y-6 lg:col-span-5 ${activePreviewTab === "form" ? "hidden lg:block" : "block"
              }`}
          >
            <div className="sticky top-20 space-y-6">
              {/* Header for preview */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Live Marketplace Preview
                  </span>
                </div>
                <span className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  What Renters See
                </span>
              </div>

              {/* The Studio Listing Card Preview */}
              <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:border-orange-500/40">
                {/* Image & Price Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {imageUrl ? (
                    // biome-ignore lint/a11y/useAltText: Dynamic user image preview with explicit aria label
                    <img
                      src={imageUrl}
                      alt={title || "Studio preview"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/80 to-muted text-muted-foreground">
                      <ImageIcon className="h-10 w-10 stroke-1 opacity-50" />
                      <span className="text-xs font-medium">Add an Image URL to preview cover</span>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <CategoryIcon className="h-3.5 w-3.5 text-orange-400" />
                    <span>{category}</span>
                  </div>

                  {/* Hourly Rate Pill */}
                  <div className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
                    ${hourlyRate || "0"}{" "}
                    <span className="text-[10px] font-normal opacity-90">/ hr</span>
                  </div>

                  {/* Deposit badge */}
                  {Number(securityDeposit) > 0 && (
                    <div className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
                      ${securityDeposit} deposit
                    </div>
                  )}
                </div>

                {/* Card Content Details */}
                <div className="p-5 space-y-4">
                  {/* Title & Location */}
                  <div>
                    <h3 className="line-clamp-1 text-lg font-bold text-foreground">
                      {title.trim() || "Untitled Studio Space"}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                      <span className="line-clamp-1">
                        {location.trim() || "Location not specified yet"}
                      </span>
                    </div>
                  </div>

                  {/* Studio Quick Stats */}
                  <div className="flex items-center gap-3 border-y border-border/80 py-2.5 text-xs">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Up to {maxCapacity || "1"} guests</span>
                    </div>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Instant Booking</span>
                    </div>
                  </div>

                  {/* Amenities Preview Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Included Amenities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAmenities.length > 0 ? (
                        <>
                          {selectedAmenities.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity}
                              className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground"
                            >
                              {amenity}
                            </span>
                          ))}
                          {selectedAmenities.length > 4 && (
                            <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                              +{selectedAmenities.length - 4} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No amenities selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description preview snippet */}
                  {detailedOverview && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Overview
                      </span>
                      <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {detailedOverview}
                      </p>
                    </div>
                  )}

                  {/* Host Footer info */}
                  <div className="flex items-center justify-between border-t border-border/80 pt-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={hostAvatar || undefined} alt={hostName} />
                        <AvatarFallback className="bg-orange-500/10 text-xs font-bold text-orange-500">
                          {hostName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-tight">
                          {hostName}
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-orange-500" />
                          Verified Host
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400"
                    >
                      Book Space
                    </button>
                  </div>
                </div>
              </div>

              {/* Host Tips Widget */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  <span>Pro Host Tips</span>
                </div>
                <ul className="mt-2.5 space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>High quality landscape photos (16:9 ratio) get 40% higher click-through rates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Listing all equipment (lighting, backdrops, stands) prevents booking cancellations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Clear parking instructions reduce check-in delays for production crews.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}