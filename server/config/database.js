import mongoose from 'mongoose';

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connection established successfully");
    } catch (error) {
        console.error("Mongoose connection error:", error);
        process.exit(1); // Exit process if connection fails
    }
};

export default ConnectDB;
