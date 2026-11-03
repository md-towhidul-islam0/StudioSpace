'use client'
import React, { Suspense } from 'react';
import { authClient } from "@/lib/auth-client" // import the auth client
import MylistingCard from '@/components/MylistingCard';
import { Loader2 } from 'lucide-react';

const page = () => {


    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()
    console.log(session);
    const Useremail = session?.user?.email

    return (
        <div>
            <Suspense fallback={<div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
                <div className="relative flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                    <Loader2 className="absolute h-5 w-5 text-orange-500 animate-spin" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground animate-pulse">
                    Loading creative studios...
                </p>
            </div>}>
                <MylistingCard Email={Useremail}></MylistingCard>
            </Suspense>
        </div>
    );
};

export default page;