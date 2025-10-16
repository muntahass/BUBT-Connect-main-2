import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(`${process.env.MONGODB_URL}/BUBTCONNECT`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected inside serverless function");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw new Error("MongoDB connection failed");
  }
};

export default connectDB;
