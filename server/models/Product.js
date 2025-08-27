import mongoose from "mongoose";
const { Schema } = mongoose;


const productSchema = new Schema({
    productName: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    productDetails: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },
    sku: { type: String, unique: true, required: true, trim: true },
    stockQuantity: { type: Number, default: 0, min: 0 },

    dimensions: {
        height: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        depth: { type: Number, min: 0 }
    },
    weight: { type: Number, required: true, min: 0 },

    material: { type: String, default: "Terracotta" },
    images: [{ type: String, required: true }],

    isHandmade: { type: Boolean, default: true },
    limitedEdition: { type: Boolean, default: false },

    discountPercentage: { type: Number, min: 0, max: 100, default: 10 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Product", productSchema);