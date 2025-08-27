import React from 'react';
import { IoBagHandleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { addGuestItem, addToCart } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);

    // Discounted price calculation
    const discountedPrice = product.discountPercentage
        ? product.price - (product.price * product.discountPercentage) / 100
        : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();

        const exists = items.find((item) => item.product._id === product._id);
        if (exists) {
            toast.success(`${product.productName} is already in your cart`);
            return;
        }

        if (user) {
            dispatch(addToCart({ productId: product._id, quantity: 1 }));
        } else {
            dispatch(addGuestItem({ productId: product._id, product, quantity: 1 }));
        }
    };

    return (
        <Link
            to={`/product/${product._id}`}
            className="group w-full flex flex-col items-center gap-3 bg-white transition-all duration-300"
        >
            {/* Image Section */}
            <div className="h-40 w-full md:h-64 rounded-lg overflow-hidden">
                <img
                    src={product.images?.[0]}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transform transition-transform duration-500 ease-in-out"
                />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 w-full px-2">
                <h3 className="pt-1 text-sm text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {product.productName} Lorem ipsum
                </h3>
                <p className="text-[11px] md:text-xs text-gray-500 line-clamp-2 h-8">
                    {product.description} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae, tempore.
                </p>
                
                <div className="flex mt-1 gap-2 items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-orange-600 font-semibold text-xs">
                            ₹{discountedPrice.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                            <span className="text-neutral-500  line-through text-[10px]">
                                ₹{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleAddToCart}
                        className="w-fit flex items-center gap-1 justify-center text-white bg-orange-600 group-hover:bg-orange-700 px-2 py-1.5 rounded text-sm active:scale-95 transition-all duration-300"
                        aria-label={`Add ${product.productName} to cart`}
                    >
                        <IoBagHandleOutline size={16} /> 
                        ADD
                    </button>
                </div>
            </div>
        </Link >
    );
}
