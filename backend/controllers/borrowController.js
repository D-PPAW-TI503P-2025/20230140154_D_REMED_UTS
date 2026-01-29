const Book = require('../models/Book');
const BorrowLog = require('../models/BorrowLog');

// Ambil semua log untuk ditampilkan di "The Royal Ledger" Admin
const getAllLogs = async (req, res) => {
  try {
    const logs = await BorrowLog.findAll({
      // WAJIB: Pakai alias 'Book' sesuai yang kita set di app.js tadi
      include: [{ 
        model: Book, 
        as: 'Book', 
        attributes: ['title'] 
      }], 
      order: [['createdAt', 'DESC']] // Supaya yang baru pinjam muncul paling atas
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { bookId, latitude, longitude } = req.body;
    const userId = req.headers['x-user-id'];

    // Validasi Header
    if (!userId) {
      return res.status(400).json({ message: "x-user-id wajib diisi di header" });
    }

    // Cari Buku
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan dalam katalog" });

    // Cek Stok
    if (book.stock <= 0) {
      return res.status(400).json({ message: "Maaf, stok buku ini sudah habis!" });
    }

    // Proses: Kurangi stok dan Simpan
    book.stock -= 1;
    await book.save();

    // Buat Catatan Peminjaman (Log)
    const log = await BorrowLog.create({
      userId,
      bookId,
      latitude,
      longitude
    });

    res.status(201).json({ 
      message: "Buku berhasil dipinjam! Segel perpustakaan telah dipasang.", 
      data: log 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { borrowBook, getAllLogs };