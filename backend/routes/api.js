const express = require('express');
const router = express.Router();
const { checkRole } = require('../middlewares/auth');
const { borrowBook, getAllLogs } = require('../controllers/borrowController'); // Import getAllLogs
const bookController = require('../controllers/bookController');

// Public
router.get('/books', bookController.getAllBooks);
router.get('/books/:id', bookController.getBookById);

// Admin Section
router.post('/books', checkRole('admin'), bookController.createBook);
router.put('/books/:id', checkRole('admin'), bookController.updateBook);
router.delete('/books/:id', checkRole('admin'), bookController.deleteBook);

// BARU: Rute untuk melihat semua peminjaman (Khusus Admin)
router.get('/borrow', checkRole('admin'), getAllLogs); 

// User Section
router.post('/borrow', checkRole('user'), borrowBook);

module.exports = router;