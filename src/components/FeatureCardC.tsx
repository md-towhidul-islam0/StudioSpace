"use client";

import {
  ArrowRight,
  Building2,
  Camera,
  Check,
  Compass,
  Film,
  ImageIcon,
  type LucideIcon,
  MapPin,
  Mic,
  Music,
  Palette,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ItypeData {
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

const FeatureCardC = ({ id }: { id: string }) => {
  const [MainData, setData] = useState<ItypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudio, setSelectedStudio] = useState<ItypeData | null>(null);

  const categoryName = decodeURIComponent(id || "");
  const HeaderIcon = getCategoryIcon(categoryName);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${apiUrl}/allstudio/${encodeURIComponent(categoryName)}`,
        );
        if (res.ok) {
          const result = await res.json();
          setData(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error("Error fetching studios in FeatureCardC:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  return (
    <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto my-8 md:my-12">
      {/* Section Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <HeaderIcon className="w-3.5 h-3.5" />
            <span>Category: {categoryName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {categoryName} Studios
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Top-rated spaces verified for your creative productions.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 self-start sm:self-auto">
          {MainData.length} {MainData.length === 1 ? "Studio" : "Studios"}{" "}
          Available
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-pulse"
            >
              <div className="aspect-[16/10] bg-muted" />
              <div className="p-5 space-y-4">
                <div className="h-4 bg-muted rounded-md w-3/4" />
                <div className="h-3 bg-muted rounded-md w-1/2" />
                <div className="h-9 bg-muted rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : MainData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground">
          <p className="text-base font-semibold">
            No {categoryName} studios found at this time.
          </p>
          <p className="text-xs mt-1">
            Try exploring other creative disciplines or view all studios.
          </p>
          <Link
            href="/explore-studio"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20"
          >
            <span>View All Studios</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        /* Studio Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MainData.map((v) => {
            const CategoryIcon = getCategoryIcon(v.category);
            return (
              <div
                key={v._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10"
              >
                {/* Studio Image & Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  {v.imageUrl ? (
                    // biome-ignore lint/performance/noImgElement: Dynamic user studio preview with dynamic fallback
                    <img
                      src={v.imageUrl}
                      alt={v.title || "Studio preview"}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/80 to-muted text-muted-foreground">
                      <ImageIcon className="h-10 w-10 stroke-1 opacity-50" />
                      <span className="text-xs font-medium">Studio Space</span>
                    </div>
                  )}

                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/15 shadow-sm">
                    <CategoryIcon className="h-3.5 w-3.5 text-orange-400" />
                    <span>{v.category || "Studio"}</span>
                  </div>

                  {/* Hourly Rate Badge ($XX / hr) */}
                  <div className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
                    ${v.hourlyRate || "0"}{" "}
                    <span className="text-[10px] font-normal opacity-90">
                      / hr
                    </span>
                  </div>

                  {/* Security Deposit Badge */}
                  {Number(v.securityDeposit) > 0 && (
                    <div className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
                      ${v.securityDeposit} deposit
                    </div>
                  )}
                </div>

                {/* Card Content Details */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2.5">
                    {/* Rating Badge & Capacity */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          (24)
                        </span>
                      </div>

                      {v.maxCapacity && (
                        <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
                          <Users className="h-3.5 w-3.5 text-muted-foreground/80" />
                          <span>Up to {v.maxCapacity} guests</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover:text-orange-500">
                      {v.title || "Untitled Studio Space"}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                      <span className="line-clamp-1">
                        {v.location || "Location not specified yet"}
                      </span>
                    </div>

                    {/* Amenities Preview Chips */}
                    {v.amenities && v.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {v.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                        {v.amenities.length > 3 && (
                          <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-orange-500">
                            +{v.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* "View Details" Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudio(v)}
                      className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/25 active:scale-[0.98]"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Studio Details Modal */}
      {selectedStudio && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Backdrop button */}
          <button
            type="button"
            aria-label="Close modal backdrop"
            tabIndex={-1}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            onClick={() => setSelectedStudio(null)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full bg-muted">
              {selectedStudio.imageUrl ? (
                // biome-ignore lint/performance/noImgElement: Modal detail preview
                <img
                  src={selectedStudio.imageUrl}
                  alt={selectedStudio.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  <ImageIcon className="h-12 w-12 opacity-50" />
                </div>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedStudio(null)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Category Pill */}
              <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                {selectedStudio.category}
              </div>

              {/* Rate */}
              <div className="absolute bottom-4 right-4 rounded-full bg-orange-500 px-3.5 py-1 text-sm font-extrabold text-white shadow-lg">
                ${selectedStudio.hourlyRate}{" "}
                <span className="text-xs font-normal">/ hr</span>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Title & Location Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 (24 reviews)</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    • Verified Studio
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-foreground">
                  {selectedStudio.title}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                  <span>
                    {selectedStudio.location ||
                      "Location provided upon booking"}
                  </span>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/40 border border-border/70 text-center">
                <div>
                  <span className="block text-[11px] font-medium text-muted-foreground uppercase">
                    Rate
                  </span>
                  <span className="text-base font-extrabold text-foreground">
                    ${selectedStudio.hourlyRate}/hr
                  </span>
                </div>
                <div className="border-x border-border/70">
                  <span className="block text-[11px] font-medium text-muted-foreground uppercase">
                    Deposit
                  </span>
                  <span className="text-base font-extrabold text-foreground">
                    {Number(selectedStudio.securityDeposit) > 0
                      ? `$${selectedStudio.securityDeposit}`
                      : "None"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-muted-foreground uppercase">
                    Capacity
                  </span>
                  <span className="text-base font-extrabold text-foreground">
                    {selectedStudio.maxCapacity || 1} guests
                  </span>
                </div>
              </div>

              {/* Overview */}
              {selectedStudio.detailedOverview && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Studio Overview
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                    {selectedStudio.detailedOverview}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {selectedStudio.amenities &&
                selectedStudio.amenities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                      Included Amenities & Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedStudio.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-xs text-foreground bg-card p-2 rounded-lg border border-border/60"
                        >
                          <Check className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Host Information */}
              <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">
                      Hosted by {selectedStudio.userName || "Verified Host"}
                    </span>
                    <span className="text-[11px]">
                      {selectedStudio.userEmail}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-6 border-t border-border/70 bg-card/90 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground block">
                  Total Rate
                </span>
                <span className="text-lg font-black text-foreground">
                  ${selectedStudio.hourlyRate}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    / hour
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert(
                    `Booking inquiry for "${selectedStudio.title}" initiated. Please proceed with checkout!`,
                  );
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-all hover:shadow-orange-500/25 active:scale-95"
              >
                <span>Instant Reserve</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCardC;
