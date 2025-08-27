const mongoose = require('mongoose');
const { Schema } = mongoose;

const CATEGORY_ENUM = [
    "Home Decor",
    "Kitchen & Dining",
    "Gardenware",
    "Festive Specials"
];

const couponSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minimumPurchaseAmount: { type: Number, default: 0, min: 0 },
    applicableCategories: [{ type: String, enum: CATEGORY_ENUM }],
    usageLimit: { type: Number, default: 1, min: 1 },
    userUsageLimit: { type: Number, default: 1, min: 1 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);
