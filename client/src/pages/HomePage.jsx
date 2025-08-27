import React from 'react'
import CommonLayout from '../layout/CommonLayout'
import Slider from '../components/Slider'
import { Link } from 'react-router-dom';
import TrustFeatures from '../components/TrustFeatures';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCategories } from '../redux/slices/categorySlice';
import CollectionCardSkeleton from '../components/CollectionCardSkeleton';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { fetchLatestProduct } from '../redux/slices/productSlice';

export default function HomePage() {
    const dispatch = useDispatch();
    const { items, loading: loadingCategory } = useSelector((state) => state.categories);
    const { latest: latestProducts, loading: loadingProducts } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchLatestProduct());
    }, [dispatch]);


    return (
        <CommonLayout>
            {/* slider */}
            <Slider />

            {/* Shop by Category */}
            <div className="my-12">
                <h2 className="text-2xl font-semibold mb-6 uppercase text-neutral-800">
                    Shop by <span className='font-extrabold text-black'>Category</span>
                </h2>
                {loadingCategory ? (
                    // Show skeletons while loading
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: items?.length }).map((_, i) => (
                            <CollectionCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map(({ name, image }, index) => (
                            <Link
                                key={index}
                                to={`/collections/${name.toLowerCase().replace(/\s+/g, "-")}`}
                                className="bg-white rounded-lg relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="relative overflow-hidden rounded-lg">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-full h-40 md:h-72 object-cover hover:scale-105 transform transition-transform duration-300 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-lg pointer-events-none" />
                                </div>
                                <h3
                                    className="absolute bottom-0 left-0 right-0 text-white text-lg font-semibold p-5 pointer-events-none"
                                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.7)" }}
                                >
                                    {name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                )}

            </div>

            {/* Banner */}
            <div className="my-12">
                <img src="/assets/D-2.webp" alt="Shop the Look" className='w-full h-96 rounded-lg' />
            </div>

            {/* Latest Collection */}
            <div id='latest-section' className="my-12">
                <h2 className="text-2xl font-semibold mb-6 uppercase text-neutral-800">
                    <span className="font-extrabold text-black">Latest </span> Collection
                </h2>
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loadingProducts ? (
                        Array.from({ length: latestProducts?.length }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))
                    ) : (
                        latestProducts?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </div>

            {/* Popular Collection */}
            <div id='popular-section' className="my-12">
                <h2 className="text-2xl font-semibold mb-6 uppercase text-neutral-800">
                    <span className='font-extrabold text-black'>Popular </span> Collection
                </h2>
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loadingProducts ? (
                        Array.from({ length: latestProducts?.length }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))
                    ) : (
                        latestProducts?.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </div>

            {/* Trust Features Section */}
            <TrustFeatures />
        </CommonLayout>
    )
}
