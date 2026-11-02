import FeatureCard from '@/components/FeatureCard';
import React, { Suspense } from 'react';

const page = () => {
    return (
        <div>
            <Suspense fallback="Loading...........">
                 <div className="mt-10">
                     <FeatureCard></FeatureCard>
                 </div>
            </Suspense>
        </div>
    );
};

export default page;