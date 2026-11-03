"use client";

import {
  ArrowRight,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
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
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

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

const TopCard = () => {
  const [MainData, setData] = useState<ItypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ;
        const res = await fetch(`${apiUrl}/allstudioLimit`);
        if (res.ok) {
          const result = await res.json();
          setData(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error("Error fetching featured studios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateNavState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    //top card section
    <section className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto my-12 md:my-16">
      {/* Section Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Top Booked Creative Spaces
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-xl">
            Discover our most sought-after studios, curated for photographers,
            filmmakers, and audio creators.
          </p>
        </div>

        {/* Left and Right Navigation Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-end">
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            disabled={isBeginning}
            aria-label="Previous studios"
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
              isBeginning
                ? "border-border/40 text-muted-foreground/30 cursor-not-allowed bg-muted/20"
                : "border-border bg-card text-foreground hover:border-orange-500 hover:bg-orange-500 hover:text-white shadow-sm active:scale-95"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            disabled={isEnd}
            aria-label="Next studios"
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
              isEnd
                ? "border-border/40 text-muted-foreground/30 cursor-not-allowed bg-muted/20"
                : "border-border bg-card text-foreground hover:border-orange-500 hover:bg-orange-500 hover:text-white shadow-sm active:scale-95"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
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
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
          <p className="text-sm">No featured studios available at this time.</p>
        </div>
      ) : (
        /* Swiper Slider (No Autoplay, interactive Left/Right buttons) */
        <Swiper
          modules={[Navigation]}
          autoplay={false}
          speed={450}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            updateNavState(swiper);
          }}
          onSlideChange={updateNavState}
          onResize={updateNavState}
          onBreakpoint={updateNavState}
          className="overflow-visible pb-4"
        >
          {MainData.map((v) => {
            const CategoryIcon = getCategoryIcon(v.category);
            return (
              <SwiperSlide key={v._id} className="h-auto">
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10">
                  {/* Studio Image & Overlay Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    {v.imageUrl ? (
                      // biome-ignore lint/performance/noImgElement: Dynamic user studio image URL with dynamic fallback
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
                        <span className="text-xs font-medium">
                          Studio Space
                        </span>
                      </div>
                    )}

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/15 shadow-sm">
                      <CategoryIcon className="h-3.5 w-3.5 text-orange-400" />
                      <span>{v.category || "Studio"}</span>
                    </div>

                    {/* Hourly Rate ($XX / hr) */}
                    <div className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
                      ${v.hourlyRate || "0"}{" "}
                      <span className="text-[10px] font-normal opacity-90">
                        / hr
                      </span>
                    </div>

                    {/* Security Deposit badge (if applicable) */}
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
                      <Link
                        href={`/explore-studio/eachDetials/${v._id}`}
                        className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/25 active:scale-[0.98]"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default TopCard;
