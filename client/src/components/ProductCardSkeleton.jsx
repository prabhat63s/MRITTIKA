import React from "react";

export default function ProductCardSkeleton() {
    return (
        <div
            className="group w-full flex flex-col items-center gap-3 bg-white transition-all duration-300"
            aria-busy="true"
            aria-live="polite"
        >
            {/* Image Section */}
            <div className="h-40 w-full md:h-64 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-neutral-200 animate-pulse" />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 w-full px-2">
                {/* Title */}
                <div className="pt-1 h-4 w-5/6 bg-neutral-200 rounded animate-pulse" />

                {/* Description (2 lines, fixed height to match .h-8) */}
                <div className="mt-1 flex flex-col gap-1 h-8">
                    <div className="w-full h-3 bg-neutral-200 rounded animate-pulse" />
                    <div className="w-4/5 h-3 bg-neutral-200 rounded animate-pulse" />
                </div>

                {/* Price + CTA */}
                <div className="flex mt-1 gap-2 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-3 w-14 bg-neutral-200 rounded animate-pulse" />
                    </div>

                    {/* Button placeholder (same sizing as your button) */}
                    <div className="px-2 py-1.5 rounded text-sm h-[30px] w-[72px] bg-neutral-200 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
