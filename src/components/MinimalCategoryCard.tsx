"use client";

import {
  Building2,
  Camera,
  Compass,
  Film,
  Grid,
  type LucideIcon,
  Mic,
  Music,
  Palette,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MinimalCategoryCardProps {
  activeCategory?: string;
}

const getCategoryIcon = (category: string): LucideIcon => {
  const norm = (category || "").toLowerCase().trim();
  if (norm === "all" || norm === "all studios") return Grid;
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

const DEFAULT_CATEGORIES = [
  "Photo Studio",
  "Podcast Lounge",
  "Film Stage",
  "Art Gallery & Loft",
  "Dance Studio",
  "Music Suite",
];

const MinimalCategoryCard = ({ activeCategory }: MinimalCategoryCardProps) => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ;
        const res = await fetch(`${apiUrl}/allstudio`);
        if (res.ok) {
          const data: { category?: string }[] = await res.json();
          if (Array.isArray(data)) {
            const uniqueCats: string[] = [];
            data.forEach((item) => {
              if (item?.category && !uniqueCats.includes(item.category)) {
                uniqueCats.push(item.category);
              }
            });
            if (uniqueCats.length > 0) {
              setCategories(uniqueCats);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching categories in MinimalCategoryCard:", err);
      }
    };

    fetchCategories();
  }, []);

  const current = (activeCategory || "all").toLowerCase().trim();
  const isAllActive =
    current === "all" || current === "all studios" || !activeCategory;

  return (
    <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto pt-6 pb-2">
      {/* Small & Minimal Category Filter Cards */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
        {/* "All" button */}
        <Link
          href="/explore-studio"
          className={`group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 border ${
            isAllActive
              ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/25"
              : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-orange-500/40 hover:bg-orange-500/5"
          }`}
        >
          <Grid
            className={`h-3.5 w-3.5 ${
              isAllActive
                ? "text-white"
                : "text-orange-500 group-hover:scale-110 transition-transform"
            }`}
          />
          <span>All Studios</span>
        </Link>

        {/* Dynamic Category Cards */}
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat);
          const isActive = current === cat.toLowerCase().trim();
          return (
            <Link
              key={cat}
              href={`/explore-studio/${encodeURIComponent(cat)}`}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 border ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/25"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-orange-500/40 hover:bg-orange-500/5"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 ${
                  isActive
                    ? "text-white"
                    : "text-orange-500 group-hover:scale-110 transition-transform"
                }`}
              />
              <span>{cat}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MinimalCategoryCard;
