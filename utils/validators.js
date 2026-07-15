import { body, validationResult } from "express-validator";

export const validateProduct = [
    body("sku").notEmpty().withMessage("SKU wajib diisi"),
    body("nama_barang").notEmpty().withMessage("Nama barang wajib diisi"),
    body("kategori_id").isInt().withMessage("Kategori ID harus berupa angka"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

export const validateTransaction = [
    body("produk_id").isInt().withMessage("Produk ID harus angka"),
    body("jumlah").isInt({ min: 1 }).withMessage("Jumlah harus angka positif minimal 1"),
    body("tipe_transaksi").isIn(["MASUK", "KELUAR"]).withMessage("Tipe harus MASUK atau KELUAR"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];
