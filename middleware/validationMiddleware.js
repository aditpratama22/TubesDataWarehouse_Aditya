
import { z } from "zod";

export const validateProduct = (req, res, next) => {
    const schema = z.object({
        sku: z.string().min(3),
        nama_barang: z.string().min(3),
        kategori_id: z.number().int().positive()
    });
    
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ 
            message: "Validasi gagal", 
            errors: result.error.errors 
        });
    }
    next();
};