// import Image from 'next/image';
// import React from 'react';




// const HeroSection = () => {
//     return (
//         <div className="w-[70%] mx-auto">
//             <Image src={banner1} alt='banner' height={1000} width={1000} className="w-full"></Image>
//             <Image src={banner2} alt='banner' height={1000} width={1000} className="w-full"></Image>

//             <h1 className="bg">Your Vision. Our Space.</h1>

//         </div>
//     );
// };

// export default HeroSection;
import React from "react";
import banner1 from "./ui/image/Banner1.jpg"
import banner2 from "./ui/image/Banner2.jpg"
import banner3 from "./ui/image/Banner3.jpg"
import banner4 from "./ui/image/Banner4.jpg"
import Link from "next/link";

const HeroSection = () => {
    return (
        <div className="w-[70%] mx-auto mt-10 mb-10">
            <div
                className="relative w-full h-[500px] bg-cover bg-center bg-no-repeat rounded-xl"
                style={{ backgroundImage: `url(${banner1.src})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-xl"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4">
                        Big Ideas Deserve Bigger Spaces
                    </h1>

                    <p className="text-lg max-w-xl">
                        From cinematic sets to professional production studios, find the perfect space to turn your vision into reality.
                    </p>
                    <div className="mt-5">
                        <Link href='/studio'>

                            <button
                                type="button"
                                className="text-[20px] rounded-lg bg-orange-500 px-4 py-3  font-medium text-white transition hover:bg-orange-600 cursor-pointer"
                            >
                                Explore Studios ➜
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;