import { Suspense } from "react";
import CatagoryCard from "@/components/CatagoryCard";
import ExtraHomeSection from "@/components/ExtraHomeSection";
import HeroSection from "@/components/HeroSection";
import TopCard from "@/components/TopCard";
import { Loader2 } from "lucide-react";
import { getTokenFromServer } from "@/components/getTokenByServer";
// import { getTokenFromClient } from "@/components/getTokenByClient";

const page = () => {
  // const token=await getTokenFromServer();
  // console.log(token)
  return (
    <div>
      {/* HeroSection renders Swiper, whose autoplay module reads `new Date()`
          during render. Suspense keeps that runtime value out of the
          prerendered shell; the fallback matches the hero's dimensions to
          avoid layout shift when the carousel hydrates. */}
      <Suspense
        fallback={
          <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto mt-8 mb-10 h-[400px] md:h-[500px] rounded-2xl bg-muted" />
        }
      >
        <HeroSection></HeroSection>
      </Suspense>

      <Suspense fallback={<div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
          <Loader2 className="absolute h-6 w-6 text-orange-500 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading workspace details...
        </p>
      </div>}>
        <CatagoryCard></CatagoryCard>
        <TopCard></TopCard>

        <ExtraHomeSection></ExtraHomeSection>
      </Suspense>


    </div>
  );
};

export default page;
