// controllers/authController.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Kredensial salah" });
        }

        const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        await prisma.user.update({ 
            where: { id: user.id }, 
            data: { refresh_token: refreshToken } 
        });

        res.cookie("token", accessToken, { httpOnly: true, maxAge: 900000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 604800000 });
        
        res.status(200).json({ message: "Login berhasil" });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: "Token kosong" });

        const user = await prisma.user.findFirst({ where: { refresh_token: refreshToken } });
        if (!user) return res.status(403).json({ message: "Token tidak valid" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Token expired" });
            
            const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
            res.cookie("token", accessToken, { httpOnly: true, maxAge: 900000 });
            res.status(200).json({ message: "Akses diperbarui" });
        });
    } catch (error) {
        next(error);
    }
};