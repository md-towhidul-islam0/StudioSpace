'use client'

import { string } from 'better-auth';
import { ImageIcon, MapPin } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface ItypeData {
    _id: string,
    title: string,
    category: string,
    hourlyRate: number,
    securityDeposit: number,
    maxCapacity: number,
    location: string,
    imageUrl: string,
    amenities: string[],
    detailedOverview: string,
    userEmail: string,
    userName: string,
    createdAt: string
}

const FeatureCard = () => {

    const [MainData, setData] = useState<ItypeData[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allstudio`)
            const result = await res.json();

            setData(result);
        };

        fetchData();
    }, []);
    return (
        <div className=" w-[70%] mx-auto">

            <div className="grid grid-cols-2 justify-center gap-5">
                {
                    MainData.map(v => <div key={v._id}>
                        <div
                        // className={`space-y-6 lg:col-span-5 ${activePreviewTab === "form" ? "hidden lg:block" : "block"
                        //     }`}
                        >
                            <div className="sticky top-20 space-y-6">
                                {/* The Studio Listing Card Preview */}
                                <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:border-orange-500/40">
                                    {/* Image & Price Badges */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                        {v.imageUrl ? (
                                            // biome-ignore lint/a11y/useAltText: Dynamic user image preview with explicit aria label
                                            <img
                                                src={v.imageUrl}
                                                alt={v.title || "Studio preview"}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/80 to-muted text-muted-foreground">
                                                <ImageIcon className="h-10 w-10 stroke-1 opacity-50" />
                                                <span className="text-xs font-medium">Add an Image URL to preview cover</span>
                                            </div>
                                        )}

                                        {/* Category Pill Tag */}
                                        {/* <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                <CategoryIcon className="h-3.5 w-3.5 text-orange-400" />
                                <span>{category}</span>
                            </div> */}

                                        {/* Hourly Rate Pill */}
                                        <div className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
                                            ${v.hourlyRate || "0"}{" "}
                                            <span className="text-[10px] font-normal opacity-90">/ hr</span>
                                        </div>

                                        {/* Deposit badge */}
                                        {Number(v.securityDeposit) > 0 && (
                                            <div className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
                                                ${v.securityDeposit} deposit
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content Details */}
                                    <div className="p-5 space-y-4">
                                        {/* Title & Location */}
                                        <div>
                                            <h3 className="line-clamp-1 text-lg font-bold text-foreground">
                                                {v.title || "Untitled Studio Space"}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                                                <span className="line-clamp-1">
                                                    {v.location || "Location not specified yet"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Studio Quick Stats */}
                                        {/* <div className="flex items-center gap-3 border-y border-border/80 py-2.5 text-xs">
                                <div className="flex items-center gap-1 font-medium text-foreground">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Up to {maxCapacity || "1"} guests</span>
                                </div>
                                <span className="text-border">•</span>
                                <div className="flex items-center gap-1 font-medium text-foreground">
                                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Instant Booking</span>
                                </div>
                            </div> */}

                                        {/* Amenities Preview Chips */}
                                        {/* <div className="space-y-1.5">
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    Included Amenities
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedAmenities.length > 0 ? (
                                        <>
                                            {selectedAmenities.slice(0, 4).map((amenity) => (
                                                <span
                                                    key={amenity}
                                                    className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                            {selectedAmenities.length > 4 && (
                                                <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                                                    +{selectedAmenities.length - 4} more
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">
                                            No amenities selected
                                        </span>
                                    )}
                                </div>
                            </div> */}

                                        {/* Description preview snippet */}
                                        {v.detailedOverview && (
                                            <div className="space-y-1">
                                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                    Overview
                                                </span>
                                                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                                    {v.detailedOverview}
                                                </p>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default FeatureCard;