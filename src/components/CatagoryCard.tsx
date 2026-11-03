import {
  ArrowUpRight,
  Building2,
  Camera,
  Compass,
  Film,
  type LucideIcon,
  Mic,
  Music,
  Palette,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface IDatatype {
  category: string;
}

// Map each category to an appropriate icon
const getCategoryIcon = (category: string): LucideIcon => {
  const normalized = (category || "").toLowerCase().trim();
  if (normalized.includes("photo") || normalized.includes("camera"))
    return Camera;
  if (
    normalized.includes("film") ||
    normalized.includes("video") ||
    normalized.includes("stage")
  )
    return Film;
  if (normalized.includes("podcast")) return Mic;
  if (
    normalized.includes("music") ||
    normalized.includes("audio") ||
    normalized.includes("sound")
  )
    return Music;
  if (
    normalized.includes("art") ||
    normalized.includes("gallery") ||
    normalized.includes("loft") ||
    normalized.includes("paint")
  )
    return Palette;
  if (normalized.includes("dance")) return Sparkles;
  if (
    normalized.includes("work") ||
    normalized.includes("maker") ||
    normalized.includes("craft")
  )
    return Building2;
  return Compass;
};

const CatagoryCard = async () => {
  const CatagoryArray: string[] = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
    const res = await fetch(`${apiUrl}/allstudio`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data: IDatatype[] = await res.json();
      if (Array.isArray(data)) {
        data.forEach((v) => {
          if (v?.category) {
            CatagoryArray.includes(v.category)
              ? ""
              : CatagoryArray.push(v.category);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error fetching categories in CatagoryCard:", error);
  }

  // CatagoryArray.map(v=> {console.log(v)});
  console.log(CatagoryArray);

  return (
    <section className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto my-12 md:my-16">
      {/* Section Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
         
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Find Your Ideal Studio Space
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
            Select a category to explore professional, curated studios ready for
            your next project.
          </p>
        </div>
      </div>

      {/* Category Cards Grid */}
      {CatagoryArray.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
          <p className="text-sm">No studio categories found at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {CatagoryArray.map((v) => {
            const Icon = getCategoryIcon(v);
            return (
              <Link
                key={v}
                href={`/explore-studio/${encodeURIComponent(v)}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10"
              >
                {/* Ambient Glow Effect */}
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/10 blur-xl transition-all duration-500 group-hover:bg-orange-500/20 group-hover:scale-125"
                  aria-hidden="true"
                />

                {/* Icon + Arrow Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-orange-500/30">
                    <Icon className="h-6 w-6 transition-transform duration-300" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all duration-300 group-hover:bg-orange-500/10 group-hover:text-orange-500">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Category Name */}
                <div className="relative z-10 mt-6">
                  <h3 className="text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-orange-500">
                    {v}
                  </h3>
                </div>

                {/* Bottom Accent Highlight */}
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500 to-orange-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CatagoryCard;
