import express from "express";
import { login, register } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js"; // Import limiter

const router = express.Router();

// Terapkan loginLimiter hanya pada route login untuk mencegah brute force
router.post("/login", loginLimiter, login); 

// Route register tidak perlu limiter yang ketat (opsional)
router.post("/register", register); 

export default router;