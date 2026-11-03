"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Compass,
  Film,
  Heart,
  Layers,
  Loader2,
  type LucideIcon,
  Mail,
  MapPin,
  Mic,
  Music,
  Palette,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Volume2,
  Wifi,
  Wind,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Toast, { type ToastData } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

export interface ItypeData {
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
}

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

const getAmenityIcon = (amenity: string): LucideIcon => {
  const norm = (amenity || "").toLowerCase();
  if (
    norm.includes("wi-fi") ||
    norm.includes("wifi") ||
    norm.includes("internet")
  )
    return Wifi;
  if (norm.includes("light")) return Sparkles;
  if (norm.includes("sound") || norm.includes("acoustic")) return Volume2;
  if (
    norm.includes("air") ||
    norm.includes("ac") ||
    norm.includes("conditioning")
  )
    return Wind;
  if (
    norm.includes("green") ||
    norm.includes("screen") ||
    norm.includes("cyclorama")
  )
    return Layers;
  if (norm.includes("coffee") || norm.includes("kitchen")) return Coffee;
  if (norm.includes("park")) return Car;
  if (
    norm.includes("24/7") ||
    norm.includes("clock") ||
    norm.includes("access")
  )
    return Clock;
  if (norm.includes("audio") || norm.includes("speaker") || norm.includes("pa"))
    return Music;
  return CheckCircle2;
};

// Curated reviews from verified creators
const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "Commercial Fashion Photographer",
    date: "2 weeks ago",
    rating: 5,
    avatar: "ER",
    comment:
      "One of the best creative spaces I've ever booked! The lighting equipment was pristine, cyclorama wall was flawlessly repainted, and the host was extraordinarily helpful during load-in.",
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Podcast Director @ CreatorLab",
    date: "1 month ago",
    rating: 5,
    avatar: "MV",
    comment:
      "Acoustics were dead-silent with zero bleed from outside. High-speed fiber Wi-Fi made our 4K multi-cam livestream completely seamless. Booking again next week!",
  },
  {
    id: 3,
    name: "Sofia Alvarez",
    role: "Indie Film Producer",
    date: "1 month ago",
    rating: 5,
    avatar: "SA",
    comment:
      "Incredible space with fantastic architectural character. Ample power distro for heavy video lighting rigs, comfortable hair & makeup station, and crystal clear communication.",
  },
];

interface EachDetialseProps {
  id: string;
}

const EachDetialse = ({ id }: EachDetialseProps) => {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [data, setData] = useState<ItypeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingHours, setBookingHours] = useState(4);
  const [crewCount, setCrewCount] = useState(4);
  const [projectType, setProjectType] = useState("Commercial Shoot");
  const [specialNotes, setSpecialNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form field unique IDs for accessibility
  const bookingDateId = useId();
  const bookingTimeId = useId();
  const bookingHoursId = useId();
  const crewCountId = useId();
  const projectTypeId = useId();
  const specialNotesId = useId();

  // Escape key and body scroll lock for modal
  useEffect(() => {
    if (!isBookingOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsBookingOpen(false);
        setBookingSuccess(false);
        setBookingLoading(false);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBookingOpen]);

  // Fetch studio specifications
  useEffect(() => {
    let isMounted = true;
    const fetchStudio = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/allstudio/d/${id}`);
        if (!res.ok) {
          throw new Error("Studio not found or unavailable.");
        }
        const result = await res.json();
        const studioDoc: ItypeData = result?.data || result;
        if (!studioDoc || !studioDoc._id) {
          throw new Error("Unable to load studio specifications.");
        }
        if (isMounted) {
          setData(studioDoc);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load studio details";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStudio();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading spinner state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <Loader2 className="absolute h-7 w-7 text-orange-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-foreground">
            Loading Workspace Specifications
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Retrieving studio features, equipment list, and availability...
          </p>
        </div>
      </div>
    );
  }

  // Error / Not Found state
  if (error || !data) {
    return (
      <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto my-16">
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center max-w-lg mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <Compass className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">
            Workspace Not Found
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            The workspace details you are looking for may have been moved or is
            temporarily offline.
          </p>
          <Link
            href="/explore-studio"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/25"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse All Studios</span>
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(data.category);

  // Curated gallery perspectives to ensure a rich carousel
  const galleryImages = [
    {
      id: "cover-main",
      src:
        data.imageUrl ||
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "perspective-wide",
      src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "perspective-lighting",
      src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "perspective-lounge",
      src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Price calculation
  const spaceSubtotal = Number(data.hourlyRate || 0) * bookingHours;
  const cleaningFee = 25;
  const deposit = Number(data.securityDeposit || 0);
  const totalAmount = spaceSubtotal + cleaningFee + deposit;

  // const handleBookingSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setBookingLoading(true);

  //   const payload = {
  //     studioId: data._id,
  //     studioTitle: data.title,
  //     hostEmail: data.userEmail,
  //     hostName: data.userName,
  //     userEmail: session?.user?.email,
  //     userName: session?.user?.name ,
  //     bookingDate,
  //     bookingTime,
  //     bookingHours,
  //     crewCount,
  //     projectType,
  //     specialNotes: specialNotes.trim(),
  //     totalAmount,
  //     createdAt: new Date().toISOString(),
  //   };

  //   try {
  //     const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  //     const res=await fetch(`${apiUrl}/booking`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     }).catch(() => null);
  //     console.log(res);
  //   } catch {
     
  //   } finally {
  //     setBookingLoading(false);
  //     setBookingSuccess(true);
  //   }
  // };
  
const handleBookingSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setBookingLoading(true);
  setBookingSuccess(false);
  const {_id,...otherData}=data;

  const payload = {
    studioId: data._id,
    studioTitle: data.title,
    hostEmail: data.userEmail,
    hostName: data.userName,
    // userEmail: session?.user?.email,
    // userName: session?.user?.name,
    bookingDate,
    bookingTime,
    bookingHours,
    crewCount,
    projectType,
    specialNotes: specialNotes.trim(),
    totalAmount,
    // createdAt: new Date().toISOString(),
    ...otherData
  };
  

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const res = await fetch(`${apiUrl}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Booking failed!");
    }

    const result = await res.json();

    console.log("Booking successful:", result);

    setBookingSuccess(true);

  } catch (error) {
    console.error("Booking error:", error);
    setBookingSuccess(false);

  } finally {
    setBookingLoading(false);
  }
};


  const resetBookingForm = () => {
    setIsBookingOpen(false);
    setBookingSuccess(false);
    setBookingLoading(false);
  };

  const handleBookClick = () => {
    if (!session) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/explore-studio/eachDetials/${id}`)}`,
      );
      return;
    }
    setIsBookingOpen(true);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: `Check out this creative workspace: ${data.title}`,
          url,
        });
      } catch {
        // User dismissed native share sheet
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setToast({
          id: Date.now(),
          type: "success",
          message: "Studio URL copied to clipboard!",
        });
      } catch {
        setToast({
          id: Date.now(),
          type: "error",
          message: "Failed to copy link to clipboard.",
        });
      }
    }
  };

  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      setToast({
        id: Date.now(),
        type: next ? "success" : "info",
        message: next ? "Saved to your favorites!" : "Removed from favorites.",
      });
      return next;
    });
  };

  return (
    <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto py-8 space-y-10">
      {/* Top Breadcrumb & Share Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/explore-studio"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-orange-500 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore Studios</span>
        </Link>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:border-orange-500/40 hover:text-orange-500 transition-colors shadow-xs cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shadow-xs cursor-pointer ${
              isSaved
                ? "border-rose-500 bg-rose-500/10 text-rose-500"
                : "border-border bg-card text-foreground hover:border-rose-500/40 hover:text-rose-500"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`}
            />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* GALLERY CAROUSEL */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg [&_.swiper-button-next]:text-orange-500 [&_.swiper-button-prev]:text-orange-500 [&_.swiper-pagination-bullet-active]:bg-orange-500">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop
          className="aspect-[16/9] md:aspect-[21/9] w-full"
        >
          {galleryImages.map((imgItem) => (
            <SwiperSlide key={imgItem.id}>
              <div className="relative h-full w-full bg-muted">
                {/* biome-ignore lint/performance/noImgElement: Gallery carousel image */}
                <img
                  src={imgItem.src}
                  alt={`${data.title} showcase perspective`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gallery Overlay Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10 shadow-sm">
            <CategoryIcon className="h-3.5 w-3.5 text-orange-400" />
            <span>{data.category}</span>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md border border-white/10 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>4.9 (28 reviews)</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="rounded-full bg-orange-500 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-white shadow-lg">
            ${data.hourlyRate}{" "}
            <span className="text-[11px] font-normal opacity-90">/ hour</span>
          </div>
        </div>
        
      </div>

      {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: SPECIFICATIONS, OVERVIEW, AMENITIES, HOST, REVIEWS */}
        <div className="lg:col-span-2 space-y-10">
          {/* Workspace Title & Location */}
          <div className="space-y-3 border-b border-border/70 pb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Verified Creative Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {data.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                <span>{data.location || "Location provided upon booking"}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-emerald-500 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Instant Confirmation</span>
              </div>
            </div>
          </div>

          {/* FULL WORKSPACE SPECIFICATIONS GRID */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Workspace Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Spec 1: Rate */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Hourly Rate
                </span>
                <p className="text-lg font-black text-foreground mt-1">
                  ${data.hourlyRate}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / hr
                  </span>
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Billed per reserved hour
                </span>
              </div>

              {/* Spec 2: Deposit */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Security Deposit
                </span>
                <p className="text-lg font-black text-foreground mt-1">
                  {Number(data.securityDeposit) > 0
                    ? `$${data.securityDeposit}`
                    : "No Deposit"}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Fully refundable on wrap
                </span>
              </div>

              {/* Spec 3: Max Capacity */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Max Capacity
                </span>
                <p className="text-lg font-black text-foreground mt-1 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span>{data.maxCapacity || 1} guests</span>
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Crew & client capacity
                </span>
              </div>

              {/* Spec 4: Discipline */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </span>
                <p className="text-base font-bold text-foreground mt-1 flex items-center gap-1.5 truncate">
                  <CategoryIcon className="h-4 w-4 text-orange-500 shrink-0" />
                  <span className="truncate">{data.category}</span>
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Professional facility
                </span>
              </div>

              {/* Spec 5: Cancellation */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Cancellation
                </span>
                <p className="text-base font-bold text-emerald-500 mt-1">
                  Flexible 24h
                </p>
                <span className="text-[10px] text-muted-foreground">
                  100% refund up to 24h before
                </span>
              </div>

              {/* Spec 6: Reference ID */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Studio Reference
                </span>
                <p className="text-base font-mono font-bold text-foreground mt-1">
                  #{data._id ? data._id.slice(-6).toUpperCase() : "STUDIO"}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Verified system listing
                </span>
              </div>
            </div>
          </div>

          {/* DETAILED OVERVIEW */}
          <div className="space-y-4 border-t border-border/70 pt-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              About This Workspace
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4 text-sm sm:text-base">
              <p className="whitespace-pre-line">
                {data.detailedOverview ||
                  "This creative production space is engineered specifically for creators who demand top-quality environments. Equipped with professional power drops, acoustic isolation, and premium amenities to ensure your production runs smoothly from initial setup to final wrap."}
              </p>
            </div>
          </div>

          {/* AMENITIES LIST */}
          <div className="space-y-4 border-t border-border/70 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Included Amenities & Equipment
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                {data.amenities?.length || 0} Features
              </span>
            </div>

            {data.amenities && data.amenities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.amenities.map((amenity) => {
                  const AmenityIcon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/70 bg-card shadow-xs group hover:border-orange-500/40 transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <AmenityIcon className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No specific amenities listed for this studio.
              </p>
            )}
          </div>

          {/* HOST DETAILS */}
          <div className="space-y-4 border-t border-border/70 pt-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Hosted by {data.userName || "Verified Studio Host"}
            </h2>

            <div className="p-6 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-orange-500/5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Host Initials Avatar */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white font-extrabold text-xl shadow-md shadow-orange-500/25">
                    {(data.userName || "SH").slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {data.userName || "Studio Manager"}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                        <BadgeCheck className="h-3 w-3" />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{data.userEmail || "host@studiospace.com"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t sm:border-t-0 sm:border-l border-border/70 pt-4 sm:pt-0 sm:pl-6">
                  <div>
                    <span className="block font-bold text-foreground">
                      &lt; 30 mins
                    </span>
                    <span className="text-[11px]">Response time</span>
                  </div>
                  <div>
                    <span className="block font-bold text-foreground">
                      100%
                    </span>
                    <span className="text-[11px]">Response rate</span>
                  </div>
                  <div>
                    <span className="block font-bold text-foreground">42+</span>
                    <span className="text-[11px]">Shoots hosted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="space-y-6 border-t border-border/70 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Verified Creator Reviews</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    (28 reviews)
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  100% verified productions hosted at this space
                </p>
              </div>

              {/* Star Score Pill */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 self-start sm:self-auto">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-base font-extrabold">4.9</span>
                <span className="text-xs text-muted-foreground">out of 5</span>
              </div>
            </div>

            {/* Ratings Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-muted/40 border border-border/70 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Cleanliness
                </span>
                <span className="text-sm font-bold text-foreground">5.0 ★</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Lighting & Gear
                </span>
                <span className="text-sm font-bold text-foreground">4.9 ★</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Communication
                </span>
                <span className="text-sm font-bold text-foreground">5.0 ★</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Accuracy
                </span>
                <span className="text-sm font-bold text-foreground">4.8 ★</span>
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {MOCK_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 font-bold text-xs">
                        {rev.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {rev.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {rev.role} • {rev.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].slice(0, rev.rating).map((starNum) => (
                        <Star
                          key={`${rev.id}-star-${starNum}`}
                          className="h-3.5 w-3.5 fill-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY BOOKING CARD */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-border/80 bg-card p-6 shadow-xl space-y-6">
            {/* Header: Hourly Rate & Guarantee */}
            <div className="flex items-baseline justify-between border-b border-border/70 pb-4">
              <div>
                <span className="text-3xl font-black text-foreground">
                  ${data.hourlyRate}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {" "}
                  / hour
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <Star className="h-3 w-3 fill-amber-400" />
                <span>4.9 (28)</span>
              </div>
            </div>

            {/* Quick Overview Parameters */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-muted-foreground">Space Category</span>
                <span className="font-bold text-foreground">
                  {data.category}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-muted-foreground">Guest Limit</span>
                <span className="font-bold text-foreground">
                  Up to {data.maxCapacity || 1} people
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-muted-foreground">Security Deposit</span>
                <span className="font-bold text-foreground">
                  {Number(data.securityDeposit) > 0
                    ? `$${data.securityDeposit}`
                    : "None"}
                </span>
              </div>
            </div>

            {/* CTA BUTTON: LAUNCHES BOOKING MODAL OR LOGIN REDIRECT */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleBookClick}
                disabled={isSessionPending}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 px-6 text-base font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/35 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
              >
                {isSessionPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Checking Session...</span>
                  </>
                ) : session ? (
                  <>
                    <span>Book Workspace Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Sign In to Book Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              {!session && !isSessionPending && (
                <p className="text-center text-[11px] text-orange-500 font-medium">
                  Account login required to reserve this workspace
                </p>
              )}
            </div>

            {/* Micro Assurances */}
            <div className="space-y-2 text-center text-[11px] text-muted-foreground pt-1">
              <p>You won&apos;t be charged until the host accepts</p>
              <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>$1,000,000 Host &amp; Creator Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE BOOKING MODAL (LAUNCHED BY "BOOK WORKSPACE NOW")                       */}
      {/* ========================================================================= */}
      {isBookingOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Backdrop Button */}
          <button
            type="button"
            aria-label="Close booking modal backdrop"
            tabIndex={-1}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            onClick={resetBookingForm}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-border/70 flex items-center justify-between bg-muted/20">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">
                  Reserve Workspace
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.title} • ${data.hourlyRate}/hr
                </p>
              </div>

              <button
                type="button"
                onClick={resetBookingForm}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            {bookingSuccess ? (
              /* Success Confirmation View */
              <div className="p-8 text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-extrabold text-foreground">
                    Booking Request Sent!
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    Your reservation request for{" "}
                    <span className="font-bold text-foreground">
                      {data.title}
                    </span>{" "}
                    has been submitted to {data.userName}. You will receive a
                    confirmation email shortly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shoot Date:</span>
                    <span className="font-bold text-foreground">
                      {bookingDate || "Upcoming Date"} at {bookingTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-bold text-foreground">
                      {bookingHours} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Total:
                    </span>
                    <span className="font-bold text-orange-500">
                      ${totalAmount}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetBookingForm}
                  className="w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Interactive Booking Form */
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
                {/* Authenticated user badge */}
                {session?.user && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/70 text-xs">
                    <span className="text-muted-foreground">Booking as:</span>
                    <span className="font-semibold text-foreground">
                      {session.user.name || session.user.email}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      ({session.user.email})
                    </span>
                  </div>
                )}

                {/* Date & Start Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor={bookingDateId}
                      className="block text-xs font-bold text-foreground"
                    >
                      Shoot Date *
                    </label>
                    <div className="relative">
                      <input
                        id={bookingDateId}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor={bookingTimeId}
                      className="block text-xs font-bold text-foreground"
                    >
                      Start Time *
                    </label>
                    <input
                      id={bookingTimeId}
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Duration & Crew Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor={bookingHoursId}
                      className="block text-xs font-bold text-foreground"
                    >
                      Duration (Hours) *
                    </label>
                    <input
                      id={bookingHoursId}
                      type="number"
                      min={1}
                      max={24}
                      required
                      value={bookingHours}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value, 10);
                        setBookingHours(
                          Number.isNaN(val)
                            ? 1
                            : Math.max(1, Math.min(24, val)),
                        );
                      }}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor={crewCountId}
                      className="block text-xs font-bold text-foreground"
                    >
                      Crew / Guests * (Max {data.maxCapacity || 15})
                    </label>
                    <input
                      id={crewCountId}
                      type="number"
                      min={1}
                      max={data.maxCapacity || 50}
                      required
                      value={crewCount}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value, 10);
                        setCrewCount(
                          Number.isNaN(val)
                            ? 1
                            : Math.max(
                                1,
                                Math.min(data.maxCapacity || 50, val),
                              ),
                        );
                      }}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Production Type */}
                <div className="space-y-1.5">
                  <label
                    htmlFor={projectTypeId}
                    className="block text-xs font-bold text-foreground"
                  >
                    Production Type *
                  </label>
                  <select
                    id={projectTypeId}
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Commercial Shoot">
                      Commercial Photography
                    </option>
                    <option value="Video Production">
                      Film &amp; Video Production
                    </option>
                    <option value="Podcast">Podcast Recording</option>
                    <option value="Music Session">Music Production</option>
                    <option value="Art Exhibition">Art Showcase / Loft</option>
                    <option value="Workshop">Creative Workshop</option>
                  </select>
                </div>

                {/* Special Requests */}
                <div className="space-y-1.5">
                  <label
                    htmlFor={specialNotesId}
                    className="block text-xs font-bold text-foreground"
                  >
                    Special Requests / Equipment Needs
                  </label>
                  <textarea
                    id={specialNotesId}
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="E.g., backdrop setup, heavy lighting rigs, parking passes..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                {/* Dynamic Price Breakdown */}
                <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      ${data.hourlyRate} × {bookingHours} hours
                    </span>
                    <span className="font-semibold text-foreground">
                      ${spaceSubtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cleaning &amp; Prep Fee</span>
                    <span className="font-semibold text-foreground">
                      ${cleaningFee}
                    </span>
                  </div>
                  {deposit > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Refundable Security Deposit</span>
                      <span className="font-semibold text-foreground">
                        ${deposit}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-border/70 pt-2 flex justify-between font-bold text-sm text-foreground">
                    <span>Estimated Total</span>
                    <span className="text-orange-500">${totalAmount}</span>
                  </div>
                </div>

                {/* Submit Button with Loading Spinner */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 px-6 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-all hover:shadow-orange-500/25 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing Reservation...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm &amp; Book Workspace</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast notifications */}
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default EachDetialse;
