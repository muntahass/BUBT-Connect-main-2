import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/BUBTCONNECT`);
    console.log("Database connected to BUBTCONNECT"); // <-- direct log
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
};

export default connectDB;
