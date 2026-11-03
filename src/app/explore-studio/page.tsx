import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import FeatureCard from "@/components/FeatureCard";
import MinimalCategoryCard from "@/components/MinimalCategoryCard";

const page = () => {
  return (
    <div className="min-h-screen pb-16">
      {/* Top small and minimal category bar */}
      <MinimalCategoryCard activeCategory="all" />

      {/* Studio Listings */}
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
              <Loader2 className="absolute h-5 w-5 text-orange-500 animate-spin" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground animate-pulse">
              Loading creative studios...
            </p>
          </div>
        }
      >
        <FeatureCard />
      </Suspense>
    </div>
  );
};

export default page;
