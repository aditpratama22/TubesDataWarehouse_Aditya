import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Pastikan cara mengambil token sesuai dengan cara kamu mengirimnya
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) return res.status(401).json({ message: "Akses ditolak" });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // <--- Ini penting! Data user disimpan di sini
        next();
    } catch (error) {
        res.status(403).json({ message: "Token tidak valid" });
    }
};