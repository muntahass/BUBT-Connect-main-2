import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/test", async (req, res) => {
  try {
    const collections = await import("mongoose").then((m) =>
      m.default.connection.db.listCollections().toArray()
    );
    res.json({ message: "MongoDB connected!", collections });
  } catch (error) {
    res
      .status(500)
      .json({ message: "MongoDB connection failed", error: error.message });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
