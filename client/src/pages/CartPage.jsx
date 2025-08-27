import React, { useEffect, useState } from "react";
import CommonLayout from "../layout/CommonLayout";
import { FaShoppingBag } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCart,
    updateCartQuantity,
    removeFromCart,
    updateGuestQuantity,
    removeGuestItem,
    setPromo,
} from "../redux/slices/cartSlice";

export default function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const { items, loading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth); // assume you have auth slice

    // Promo code state
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState("");

    const DELIVERY_CHARGE = 50;

    // Load cart for logged-in users
    useEffect(() => {
        if (user) {
            dispatch(fetchCart());
        }
    }, [user, dispatch]);

    // Quantity change
    const handleQuantityChange = (id, newQty) => {
        if (newQty < 1) return;

        if (user) {
            dispatch(updateCartQuantity({ productId: id, quantity: newQty }));
        } else {
            dispatch(updateGuestQuantity({ productId: id, quantity: newQty }));
        }
    };

    // Remove item
    const handleRemoveItem = (id) => {
        if (user) {
            dispatch(removeFromCart(id));
        } else {
            dispatch(removeGuestItem(id));
        }
    };

    // Apply promo code
    const applyPromoCode = () => {
        if (promoCode === "SAVE10") {
            setDiscount(0.1);
            setError("");
        } else if (promoCode === "SAVE20") {
            setDiscount(0.2);
            setError("");
        } else {
            setDiscount(0);
            setError("Invalid promo code");
        }
    };

    const handleProceedToCheckout = () => {
        dispatch(setPromo({ code: promoCode, discount }));
        navigate("/checkout");
    };

    // Calculations
    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const discountAmount = subtotal * discount;
    const totalPayable = subtotal - discountAmount + DELIVERY_CHARGE;
    const effectiveDiscount = discount;

    return (
        <CommonLayout>
            <div className="w-full">
                <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
                        <FaShoppingBag size={64} className="text-orange-600 mb-4" />
                        <p className="text-gray-700 text-lg mb-4">Your cart is empty.</p>
                        <p className="text-gray-500 mb-6">
                            Looks like you haven’t added anything to your cart yet.
                        </p>
                        <Link
                            to="/"
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded font-semibold transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="w-full h-fit flex md:flex-row flex-col gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Cart Items */}
                        <div className="w-full md:w-2/3 flex flex-col divide-y divide-gray-200 pb-2 md:pr-6">
                            {items.map(({ product, quantity }) => (
                                <div
                                    key={product._id}
                                    className="flex items-center pb-4 mt-4"
                                >
                                    <img
                                        src={product.images?.[0] || "/placeholder.png"}
                                        alt={product.productName}
                                        className="w-24 h-24 object-cover rounded-lg mr-6"
                                    />
                                    <div className="w-full items-start md:items-center flex md:flex-row flex-col">
                                        <div className="flex-1">
                                            <h2 className="text-base">{product.productName}</h2>
                                            <p className="text-orange-600 font-bold">
                                                ₹{product.price?.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(product._id, quantity - 1)
                                                }
                                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center">{quantity}</span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(product._id, quantity + 1)
                                                }
                                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex w-full md:w-fit justify-between items-center">
                                            <p className="w-24 md:text-right md:font-semibold">
                                                ₹{(product.price * quantity).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => handleRemoveItem(product._id)}
                                                className="ml-6 text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="w-full h-fit md:w-1/3 space-y-2">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="flex justify-between items-center">
                                <p>Subtotal</p>
                                <p>₹{subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Discount ({(effectiveDiscount * 100).toFixed(0)}%)</p>
                                <p>- ₹{discountAmount.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Delivery</p>
                                <p>₹{DELIVERY_CHARGE.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between border-dotted border-t border-b items-center border-gray-300 py-2 my-2">
                                <p className="text-lg font-semibold">Total</p>
                                <p className="text-lg font-semibold">
                                    ₹{totalPayable.toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <p>Do you have a promotional code?</p>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="w-full px-3 py-2 border border-gray-200 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                By proceeding to checkout, you agree to our Terms of Service and
                                Privacy Policy.
                            </p>

                            <button
                                onClick={handleProceedToCheckout}
                                className="mt-4 w-full bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700 font-semibold"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </CommonLayout>
    );
}
