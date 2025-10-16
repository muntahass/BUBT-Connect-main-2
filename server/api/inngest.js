import { serve } from "inngest/express";
import { inngest, functions } from "../inngest/index.js";
import connectDB from "../configs/db.js";

// Connect MongoDB inside serverless runtime
await connectDB();

// Export serverless handler
export default serve({ client: inngest, functions });
