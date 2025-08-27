import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import CommonLayout from "../layout/CommonLayout";

export default function OrderSuccess() {
    return (
        <CommonLayout>
            <div className="md:h-[600px] h-[500px] w-full bg-white flex items-center justify-center">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <FaRegCheckCircle className="text-green-500 w-20 h-20" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                        🎉 Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for shopping with us. Your order has been confirmed and will
                        be shipped soon.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <Link
                            to="/user/orders"
                            className="w-full md:w-1/2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                        >
                            View Orders
                        </Link>
                        <Link
                            to="/"
                            className="w-full md:w-1/2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </CommonLayout>
    );
}
