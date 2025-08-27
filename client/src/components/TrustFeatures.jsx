import React from 'react';
import { FaCreditCard, FaTag } from 'react-icons/fa';
import { LuRefreshCcw } from "react-icons/lu";

export default function TrustFeatures() {
    const features = [
        {
            icon: <FaTag className="w-6 h-6 text-orange-600" />,
            title: "Lowest Price",
            subtitle: "Guaranteed",
        },
        {
            icon: <FaCreditCard className="w-6 h-6 text-orange-600" />,
            title: "Cash on Delivery",
            subtitle: "Available",
        },
        {
            icon: <LuRefreshCcw className="w-6 h-6 text-orange-600" />,
            title: "7-day Returns",
            subtitle: "Hassle-Free",
        },
    ];

    return (
        <div className="flex flex-wrap justify-center md:justify-evenly gap-12 text-gray-700 border-t border-gray-200 pt-10">
            {features.map(({ icon, title, subtitle }, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                    {icon}
                    <strong className="text-lg font-semibold">{title}</strong>
                    <span className="text-sm">{subtitle}</span>
                </div>
            ))}
        </div>
    );
}
