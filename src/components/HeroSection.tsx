



"use client";

import React from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import banner1 from "./ui/image/Banner1.jpg";
import banner2 from "./ui/image/Banner2.jpg";
import banner3 from "./ui/image/Banner3.jpg";
import banner4 from "./ui/image/Banner4.jpg";

const slides = [
    {
        id: 1,
        image: banner1,
        subtitle: "YOUR VISION, OUR SPACE",
        title: "Big Ideas Deserve Bigger Spaces",
        description:
            "From cinematic sets to professional production studios, find the perfect space to bring your creative vision to life.",
    },
    {
        id: 2,
        image: banner2,
        subtitle: "CREATE WITHOUT LIMITS",
        title: "Your Next Masterpiece Starts Here",
        description:
            "Discover inspiring spaces designed for photographers, filmmakers, and creators who dream big.",
    },
    {
        id: 3,
        image: banner3,
        subtitle: "FIND YOUR PERFECT STUDIO",
        title: "The Right Space Changes Everything",
        description:
            "Explore unique creative studios equipped to turn your next big idea into something extraordinary.",
    },
    {
        id: 4,
        image: banner4,
        subtitle: "SHARE YOUR CREATIVE SPACE",
        title: "Have a Space? Make It Inspire.",
        description:
            "List your studio, connect with passionate creators, and turn your space into an opportunity.",
    },
];

const HeroSection = () => {
    return (
        <section className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto mt-8 mb-10">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                className="hero-swiper overflow-hidden rounded-2xl"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="relative flex h-[400px] md:h-[500px] items-center justify-center bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${slide.image.src})`,
                            }}
                        >
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/55" />

                            {/* Slide content */}
                            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center text-white">
                                <span className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                                    {slide.subtitle}
                                </span>

                                <h1 className="mb-5 text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                                    {slide.title}
                                </h1>

                                <p className="max-w-2xl text-sm leading-7 text-gray-200 md:text-lg">
                                    {slide.description}
                                </p>

                                <div className="mt-8 flex flex-wrap justify-center gap-4">
                                    <Link
                                        href="/studio"
                                        className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                                    >
                                        Explore Studios →
                                    </Link>

                                    <Link
                                        href="/studio"
                                        className="rounded-lg border border-white/80 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
                                    >
                                        Host Your Space
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

        </section>
    );
};

export default HeroSection;
