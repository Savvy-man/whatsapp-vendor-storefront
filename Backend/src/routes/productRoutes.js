import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Simple Admin PIN check
const verifyAdmin = (req, res, next) => {
  const pin = req.headers["x-admin-pin"];
  if (!pin || pin !== process.env.ADMIN_PIN) {
    return res.status(401).json({ message: "Invalid Admin PIN" });
  }
  next();
};

// GET all products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new product (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, price, category, image, inStock } = req.body;
    const product = await Product.create({ name, price, category, image, inStock });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH toggle inStock or update product (Admin only)
router.patch("/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
