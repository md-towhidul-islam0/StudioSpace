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
          <div className="text-center py-12 text-muted-foreground text-sm">
            Loading studios...
          </div>
        }
      >
        <FeatureCard />
      </Suspense>
    </div>
  );
};

export default page;
