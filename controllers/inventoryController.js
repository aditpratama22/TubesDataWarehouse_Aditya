import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 1. Menambah barang baru
export const createProduct = async (req, res, next) => {
    try {
        const { sku, nama_barang, kategori_id, image_url } = req.body;
        const newProduct = await prisma.product.create({
            data: { 
                sku, 
                nama_barang, 
                kategori_id: parseInt(kategori_id), 
                image_url 
            }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        next(error); // Menggunakan Global Error Middleware
    }
};

// 2. Transaksi Stok (Masuk/Keluar) dengan Proteksi
export const addTransaction = async (req, res, next) => {
    try {
        const { produk_id, tipe_transaksi, jumlah, keterangan } = req.body;
        const user_id = req.user.id;

        // Cek apakah produk tersedia
        const product = await prisma.product.findUnique({ where: { id: parseInt(produk_id) } });
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Validasi stok untuk transaksi KELUAR
        if (tipe_transaksi === "KELUAR" && product.total_stok < jumlah) {
            return res.status(400).json({ message: "Stok tidak mencukupi" });
        }

        // Update stok di tabel Product
        const increment = tipe_transaksi === "MASUK" ? jumlah : -jumlah;
        await prisma.product.update({
            where: { id: parseInt(produk_id) },
            data: { total_stok: { increment } }
        });

        // Catat di tabel InventoryTransaction
        const transaction = await prisma.inventoryTransaction.create({
            data: { 
                produk_id: parseInt(produk_id), 
                user_id, 
                tipe_transaksi, 
                jumlah, 
                keterangan 
            }
        });

        res.status(201).json({ message: "Transaksi berhasil", transaction });
    } catch (error) {
        next(error); // Menggunakan Global Error Middleware
    }
};

// 3. Melihat Daftar Barang
export const getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true // Pastikan nama relasi di schema.prisma adalah 'category'
            }
        });
        res.status(200).json(products);
    } catch (error) {
        next(error); // Menggunakan Global Error Middleware
    }
};