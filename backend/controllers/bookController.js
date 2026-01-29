const { Op } = require('sequelize');
const Book = require('../models/Book');

// GET ALL - Sekarang Mendukung Pencarian (Search)
const getAllBooks = async (req, res) => {
  try {
    // 1. Ambil parameter 'search' dari URL query (misal: /api/books?search=laskar)
    const { search } = req.query;
    
    let whereClause = {};

    // 2. Jika ada parameter search, buat kondisi pencarian
    if (search) {
      whereClause = {
        [Op.or]: [
          { id: { [Op.like]: `%${search}%` } },      // Cari berdasarkan ID
          { title: { [Op.like]: `%${search}%` } },   // Cari berdasarkan Judul
          { author: { [Op.like]: `%${search}%` } }   // Cari berdasarkan Penulis
        ]
      };
    }

    // 3. Eksekusi findAll dengan kondisi where
    const books = await Book.findAll({ 
      where: whereClause,
      order: [['id', 'ASC']] // Urutkan berdasarkan ID biar rapi
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createBook = async (req, res) => {
  try {
    const { title, author, stock } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title dan Author wajib diisi!" });
    }

    const newBook = await Book.create({ 
      title, 
      author, 
      stock: parseInt(stock) || 0 
    });
    res.status(201).json({ message: "Buku berhasil ditambahkan", data: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateBook = async (req, res) => {
  try {
    const { title, author, stock } = req.body;
    const book = await Book.findByPk(req.params.id);

    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

    book.title = title || book.title;
    book.author = author || book.author;
    book.stock = stock !== undefined ? parseInt(stock) : book.stock;

    await book.save();
    res.status(200).json({ message: "Buku berhasil diperbarui", data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

    await book.destroy();
    res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};