import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Cek apakah user ada di database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        // Cek password (menggunakan bcrypt)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah" });

        // Buat token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Kirim token ke cookie
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({ message: "Login berhasil", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}; // <-- Tutup kurung kurawal fungsi login di sini

export const register = async (req, res) => {
    const { nama, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = await prisma.user.create({
            data: { nama, email, password: hashedPassword }
        });
        res.status(201).json({ message: "User berhasil dibuat", user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; // <-- Tutup kurung kurawal fungsi register di sini
