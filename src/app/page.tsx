import { Suspense } from "react";
import CatagoryCard from "@/components/CatagoryCard";
import ExtraHomeSection from "@/components/ExtraHomeSection";
import HeroSection from "@/components/HeroSection";
import TopCard from "@/components/TopCard";

const page = () => {
  return (
    <div>
      <HeroSection></HeroSection>

      <Suspense fallback="Loading...........">
        <CatagoryCard></CatagoryCard>
      </Suspense>

      <TopCard></TopCard>

      <ExtraHomeSection></ExtraHomeSection>
    </div>
  );
};

export default page;
