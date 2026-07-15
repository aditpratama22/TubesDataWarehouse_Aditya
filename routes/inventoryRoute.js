import express from "express";
import { createProduct, addTransaction, getProducts } from "../controllers/inventoryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateProduct, validateTransaction } from "../utils/validators.js";

const router = express.Router();

// Route untuk melihat daftar produk
router.get("/products", verifyToken, getProducts);

// Route untuk menambah produk
router.post("/products", verifyToken, validateProduct, createProduct);

// Route untuk transaksi stok
router.post("/transaction", verifyToken, validateTransaction, addTransaction);

export default router;