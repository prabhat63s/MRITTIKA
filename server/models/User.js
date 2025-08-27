    import mongoose from "mongoose";
    const { Schema } = mongoose;

    const addressSchema = new Schema(
        {
            userName: { type: String, required: true },
            mobile: { type: String, required: true },
            pincode: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            locality: { type: String },
            landmark: { type: String },
            type: { type: String, enum: ["home", "office", "other"], default: "home" },
            isDefault: { type: Boolean, default: false },
        },
        { _id: true } // keep _id so each address can be edited/deleted individually
    );

    const userSchema = new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        isActive: { type: Boolean, default: true },
        addresses: [addressSchema],
        otp: { type: String },
        otpExpires: { type: Date },
        createdAt: { type: Date, default: Date.now },
    });

    export default mongoose.model("User", userSchema);
