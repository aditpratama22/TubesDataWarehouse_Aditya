import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";

// 1. Import Global Error Handler
import { errorHandler } from "./middleware/errorHandler.js";

// Inisialisasi pembacaan file .env
dotenv.config();

const app = express();
// Menggunakan port dari .env jika ada, jika tidak gunakan 3000
const PORT = process.env.PORT || 3000; 

// Middleware bawaan
app.use(cors({ credentials: true, origin: true })); 
app.use(express.json()); 
app.use(cookieParser());

// Route API
app.use("/auth", authRoute); 
app.use("/inventory", inventoryRoute);

// Route percobaan
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Selamat datang di API Warehouse Inventory!",
    status: "Ready"
  });
});

// 2. Pasang Global Error Handler di PALING BAWAH (wajib setelah semua route)
app.use(errorHandler);

// Menyalakan server
app.listen(PORT, () => {
  console.log(`🚀 Server backend menyala di http://localhost:${PORT}`);
});