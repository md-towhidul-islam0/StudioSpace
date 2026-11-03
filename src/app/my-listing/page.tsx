'use client'
import React, { Suspense } from 'react';
import { authClient } from "@/lib/auth-client" // import the auth client
import MylistingCard from '@/components/MylistingCard';

const page =  () => {


    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()
    console.log(session);
    const Useremail=session?.user?.email

    return (
        <div>
            <Suspense fallback={<div>Loading</div>}>
                <MylistingCard Email={Useremail}></MylistingCard>
            </Suspense>
        </div>
    );
};

export default page;