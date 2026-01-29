require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');

// Import Models untuk mendefinisikan relasi
const Book = require('./models/Book');
const BorrowLog = require('./models/BorrowLog');

const app = express();

// 1. Middleware
app.use(cors()); // PENTING: Agar React bisa akses API ini
app.use(express.json()); // Parsing format JSON

// 2. Definisi Relasi (PENTING: Agar judul buku muncul di tabel log Admin)
// Satu buku bisa dipinjam berkali-kali
Book.hasMany(BorrowLog, { foreignKey: 'bookId', as: 'Logs' });
// Satu baris log merujuk pada satu buku tertentu
BorrowLog.belongsTo(Book, { foreignKey: 'bookId', as: 'Book' });

// 3. Routing
app.use('/api', apiRoutes);

// 4. Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Backend Error:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server internal" });
});

const PORT = process.env.PORT || 3000;

// 5. Database Connection & Start Server
const startServer = async () => {
  try {
    // Cek koneksi ke MySQL
    await sequelize.authenticate();
    console.log('✅ Connection to MySQL established successfully.');

    // Sinkronisasi tabel (force: false agar data buku tidak terhapus)
    await sequelize.sync({ force: false });
    console.log('✅ Database & Tables synced.');

    app.listen(PORT, () => {
      console.log(`🚀 Server is flying on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Jalankan Server
startServer();