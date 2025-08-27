import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommonLayout from '../layout/CommonLayout';
import ProductCard from '../components/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { FaAngleDown } from 'react-icons/fa';
import { fetchCategories } from '../redux/slices/categorySlice';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export default function CollectionPage() {
    const { category } = useParams();
    const dispatch = useDispatch();

    // get products & categories from slice
    const { items: products, loading: loadingProducts, } = useSelector((state) => state.products);
    const { items: categories } = useSelector((state) => state.categories);

    // local filtered products
    const [filteredProducts, setFilteredProducts] = useState([]);

    // fetch products on mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
    }, [dispatch]);

    // filter by category slug
    useEffect(() => {
        if (category && products.length > 0) {
            const filtered = products.filter(
                (p) => p.category?.name?.toLowerCase().replace(/\s+/g, "-") === category
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [category, products]);

    const sortOptions = [
        { name: 'Most Popular', value: 'popular' },
        { name: 'Best Rating', value: 'rating' },
        { name: 'Newest', value: 'newest' },
        { name: 'Price: Low to High', value: 'lowToHigh' },
        { name: 'Price: High to Low', value: 'highToLow' },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <CommonLayout>
            <div className="w-full mt-6 mb-12">
                <div className="flex gap-2 justify-between mb-6">
                    {/* Filter Menu */}
                    <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                            Filter
                            <FaAngleDown
                                aria-hidden="true"
                                className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                            />
                        </MenuButton>

                        <MenuItems
                            transition
                            className="absolute left-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl"
                        >
                            <div className="py-1">
                                {categories.map((option) => (
                                    <MenuItem key={option._id}>
                                        <Link
                                            to={`/collections/${option.name.toLowerCase().replace(/\s+/g, "-")}`}
                                            className={classNames(
                                                'text-gray-500',
                                                'block px-4 py-2 text-sm data-focus:bg-gray-100'
                                            )}
                                        >
                                            {option.name}
                                        </Link>
                                    </MenuItem>
                                ))}
                            </div>
                        </MenuItems>
                    </Menu>

                    <p>
                        {filteredProducts.length} {filteredProducts.length <= 1 ? 'product' : 'products'} found
                    </p>

                    {/* Sort Menu */}
                    <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                            Sort
                            <FaAngleDown
                                aria-hidden="true"
                                className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                            />
                        </MenuButton>

                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl"
                        >
                            <div className="py-1">
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value}>
                                        <button
                                            className={classNames(
                                                'text-gray-500 w-full flex  px-4 py-2 text-sm data-focus:bg-gray-100'
                                            )}
                                            onClick={() => {
                                                let sorted = [...filteredProducts];
                                                if (option.value === 'lowToHigh') sorted.sort((a, b) => a.price - b.price);
                                                if (option.value === 'highToLow') sorted.sort((a, b) => b.price - a.price);
                                                if (option.value === 'newest') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                                                setFilteredProducts(sorted);
                                            }}
                                        >
                                            {option.name}
                                        </button>
                                    </MenuItem>
                                ))}
                            </div>
                        </MenuItems>
                    </Menu>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loadingProducts ? (
                        Array.from({ length: filteredProducts.length }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))
                    ) : (
                        filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </CommonLayout>
    );
}
