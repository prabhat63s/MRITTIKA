import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            productName: String,
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }, // single unit price
            total: { type: Number, required: true }, // quantity * price
        },
    ],

    amount: { type: Number, required: true },

    paymentMode: {
        type: String,
        required: true,
        enum: ["COD", "card"],
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },

    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
        default: "pending",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    address: {
        userName: { type: String, required: true },
        mobile: { type: String, required: true },
        pincode: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        locality: String,
        landmark: String,
    },
}, { timestamps: true });

// auto-calc amount before save
orderSchema.pre("save", function (next) {
    this.amount = this.items.reduce((sum, item) => sum + item.total, 0);
    next();
});

// indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);
