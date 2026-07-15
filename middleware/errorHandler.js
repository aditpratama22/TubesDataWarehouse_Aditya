export const errorHandler = (err, req, res, next) => {
    // Log error di terminal agar kamu tetap bisa melakukan debugging
    console.error(err.stack);

    // Ambil status code (default ke 500 jika tidak ada)
    const statusCode = err.statusCode || 500;
    
    // Pesan error default
    const message = err.message || "Terjadi kesalahan internal pada server";

    // Kirim respon JSON yang rapi ke klien/Postman
    res.status(statusCode).json({
        success: false,
        message: message,
        // Tips Pro: Jangan tampilkan stack trace jika aplikasi sudah "production"
        error: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};