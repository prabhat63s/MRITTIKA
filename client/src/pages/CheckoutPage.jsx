import React, { useEffect, useState } from "react";
import CommonLayout from "../layout/CommonLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { items, promoCode, discount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const DELIVERY_CHARGE = 50;

  const [step, setStep] = useState(1);
  console.log(user);

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone_number: user.mobile || "",
    pincode: "",
    street: "",
    city: "",
    state: "",
    locality: "",
    landmark: "",
    paymentMode: "COD",
    cardNumber: "",
    expiry: "",
    cvc: "",
    upiId: "",
  });

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user, dispatch]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // here you’d call your API to create order
    console.log("Order Data:", formData);
    navigate('/order-success')
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const totalPayable = subtotal - discountAmount + DELIVERY_CHARGE;

  return (
    <CommonLayout>
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
        <div className="w-full flex flex-col md:flex-row gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">

          {/* Left: Form Section */}
          <form
            onSubmit={step === 1 ? handleNext : handleSubmit}
            className="w-full md:w-2/3 flex flex-col space-y-4 pb-2 md:pr-6"
          >
            {step === 1 && (
              <>
                <h3 className="text-xl font-semibold mt-4">Shipping Address</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="locality"
                    placeholder="Locality"
                    value={formData.locality}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <button
                  type="submit"
                  className="mt-4 w-full md:w-fit ml-auto bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700 font-semibold"
                >
                  Continue to Payment
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-xl font-semibold mb-4">Payment Information</h3>

                {/* Payment Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {["COD", "card", "upi"].map((mode) => (
                    <div
                      key={mode}
                      onClick={() => setFormData({ ...formData, paymentMode: mode })}
                      className={`cursor-pointer border rounded-lg px-4 py-2 flex justify-center items-center transition-all duration-200 ${formData.paymentMode === mode
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <span className="text-lg font-medium capitalize">
                        {mode === "COD"
                          ? "Cash on Delivery"
                          : mode === "card"
                            ? "Credit / Debit Card"
                            : "UPI"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Payment Fields */}
                {formData.paymentMode === "card" && (
                  <div className="space-y-4 animate-fadeIn">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      required
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleChange}
                        className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />
                      <input
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        value={formData.cvc}
                        onChange={handleChange}
                        className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* UPI Payment Fields */}
                {formData.paymentMode === "upi" && (
                  <div className="animate-fadeIn">
                    <input
                      type="text"
                      name="upiId"
                      placeholder="Enter UPI ID (e.g. yourname@upi)"
                      value={formData.upiId}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      required
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between gap-4 mt-6">
                  <button
                    onClick={handleBack}
                    type="button"
                    className="w-1/2 md:w-fit bg-gray-100 text-gray-700 px-6 py-3 rounded hover:bg-gray-200 font-medium transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 md:w-fit bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700 font-semibold transition"
                  >
                    Place Order →
                  </button>
                </div>
              </>
            )}

          </form>

          {/* Right: Order Summary */}
          <div className="w-full md:w-1/3 space-y-2">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between items-center">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Discount ({(discount * 100).toFixed(0)}%)</p>
              <p>- ₹{discountAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Delivery</p>
              <p>₹{DELIVERY_CHARGE.toFixed(2)}</p>
            </div>
            <div className="flex justify-between border-t border-b border-gray-300 py-2 my-2">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-lg font-semibold">₹{totalPayable.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
