import CatagoryCard from '@/components/CatagoryCard';
import HeroSection from '@/components/HeroSection';
import TopCard from '@/components/TopCard';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <div>
      <HeroSection></HeroSection>

      <Suspense fallback="Loading...........">
        <CatagoryCard></CatagoryCard>
      </Suspense>

      <TopCard></TopCard>
    </div>
  );
};

export default page;