import express from "express";
import { login, register, refresh } from "../controllers/authController.js"; // Import 'refresh'
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Route login dengan Rate Limiting untuk mencegah Brute Force
router.post("/login", loginLimiter, login); 

// Route untuk mendaftar user baru
router.post("/register", register); 

// Route untuk mendapatkan Access Token baru menggunakan Refresh Token
// Ini penting agar user tidak harus login ulang setiap 15 menit
router.get("/refresh", refresh);

export default router;