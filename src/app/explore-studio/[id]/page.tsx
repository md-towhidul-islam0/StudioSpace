import { Suspense } from "react";
import FeatureCardC from "@/components/FeatureCardC";
import MinimalCategoryCard from "@/components/MinimalCategoryCard";

const page = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;

  return (
    <div className="min-h-screen pb-16">
      {/* Top small and minimal category bar */}
      <MinimalCategoryCard activeCategory={id} />

      {/* Category filtered studio listings */}
      <Suspense
        fallback={
          <div className="text-center py-12 text-muted-foreground text-sm">
            Loading studios...
          </div>
        }
      >
        <FeatureCardC id={id} />
      </Suspense>
    </div>
  );
};

export default page;
