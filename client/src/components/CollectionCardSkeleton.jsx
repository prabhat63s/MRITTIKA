import React from "react";

export default function CollectionCardSkeleton() {
    return (
        <div className="bg-white rounded-lg relative overflow-hidden shadow-md transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative overflow-hidden rounded-lg">
                {/* Image placeholder */}
                <div className="w-full h-40 md:h-72 bg-neutral-200 animate-pulse" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-lg pointer-events-none" />
            </div>

            {/* Title placeholder */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="h-5 w-1/2 bg-neutral-300 rounded animate-pulse" />
            </div>
        </div>
    );
}
