import FeatureCardC from '@/components/FeatureCardC';
import React from 'react';

const page = async ({ params }: {
    params: Promise<{
        id: string;
    }>;
}) => {
    const { id } = await params;
    console.log(id);


    return (
        <div>
            <FeatureCardC id={id}></FeatureCardC>
        </div>
    );
};

export default page;