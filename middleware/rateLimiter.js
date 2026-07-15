import rateLimit from 'express-rate-limit';

// Rate limiter untuk login (Lebih ketat: max 5 kali percobaan per 15 menit)
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, 
    message: { message: "Terlalu banyak percobaan login, coba lagi setelah 15 menit." },
    standardHeaders: true,
    legacyHeaders: false,
});