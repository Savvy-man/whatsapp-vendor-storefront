import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./src/routes/productRoutes.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp Storefront API is running...");
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log("Server running on port " + PORT));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
