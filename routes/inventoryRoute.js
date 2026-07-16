import express from "express";
import { createProduct, addTransaction, getProducts } from "../controllers/inventoryController.js";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js"; // Import keduanya
import { validateProduct, validateTransaction } from "../utils/validators.js";

const router = express.Router();

// Route untuk melihat daftar produk (Bisa diakses oleh semua user yang login)
router.get("/products", verifyToken, getProducts);

// Route untuk menambah produk (HANYA ADMIN yang bisa akses)
router.post("/products", verifyToken, authorizeRole(["ADMIN"]), validateProduct, createProduct);

// Route untuk transaksi stok (Admin dan Staff bisa akses)
router.post("/transaction", verifyToken, authorizeRole(["ADMIN", "STAFF"]), validateTransaction, addTransaction);

export default router;