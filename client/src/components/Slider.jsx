import React, { useState, useEffect, useRef } from 'react';

const slides = [
    {
        id: 1,
        image: '/assets/D-2.webp',
        alt: 'Beautiful handcrafted terracotta vase',
    },
    {
        id: 2,
        image: '/assets/D-2.webp',
        alt: 'Terracotta kitchenware collection',
    },
    {
        id: 3,
        image: '/assets/D-2.webp',
        alt: 'Festive terracotta diyas lit at night',
    },
];

export default function Slider() {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef(null);

    // Clear and reset the timeout
    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrent((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
        }, 3000);

        return () => resetTimeout();
    }, [current]);

    return (
        <div className="relative w-full overflow-hidden rounded-lg">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map(({ id, image, alt }) => (
                    <div key={id} className="min-w-full relative">
                        <img src={image} alt={alt} className="w-full h-64 md:h-96 object-cover" />
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {slides.map((slide, idx) => (
                    <button
                        key={slide.id}
                        className={`w-4 h-4 rounded-full focus:outline-none transition-colors ${idx === current ? 'bg-orange-600' : 'bg-gray-300'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                        onClick={() => setCurrent(idx)}
                    />
                ))}
            </div>
        </div>
    );
}
