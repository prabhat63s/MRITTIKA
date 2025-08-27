const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
