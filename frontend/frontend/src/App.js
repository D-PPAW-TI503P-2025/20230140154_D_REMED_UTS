import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AnimatePresence, motion } from 'framer-motion';
// Menambahkan 'Search' ke dalam import lucide-react
import { RefreshCcw, ScrollText, Sparkles, Search } from 'lucide-react';
import { useMap } from 'react-leaflet';

// Import Components
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import BookCard from './components/BookCard';
import BorrowLogs from './components/BorrowLogs';
import './App.css';

const API_URL = 'http://localhost:3000/api';

// Kompnen helper untuk update view peta Leaflet
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

function App() {
  const [books, setBooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [role, setRole] = useState('user');
  const [location, setLocation] = useState(null);
  const [forms, setForms] = useState({ title: '', author: '', stock: '', userId: '', bookId: '' });
  
  // Menambahkan state untuk pencarian
  const [searchQuery, setSearchQuery] = useState('');

  // Sinkronisasi data saat role berubah atau aplikasi pertama kali dijalankan
  useEffect(() => { 
    fetchAllData(); 
  }, [role]);

  // Efek pencarian dengan Debounce (menunggu user selesai mengetik 500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchAllData = async () => {
    await fetchBooks();
    if (role === 'admin') await fetchLogs();
  };

  const fetchBooks = async () => {
    try {
      // Menambahkan query string ?search= ke endpoint API
      const res = await axios.get(`${API_URL}/books?search=${searchQuery}`);
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Gagal mengambil arsip buku:", err); 
      setBooks([]); 
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/borrow`, { 
        headers: { 'x-user-role': 'admin' } 
      });
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Gagal mengambil catatan log:", err); 
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      return Swal.fire('Error', 'Celestial positioning (GPS) is not supported.', 'error');
    }

    Swal.fire({ 
      title: 'Summoning Location...', 
      html: 'Aligning coordinates with archival satellites...',
      didOpen: () => Swal.showLoading(), 
      allowOutsideClick: false,
      background: '#fdfcf0'
    });
    
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      Swal.close();
      Swal.fire({ 
        icon: 'success', 
        title: 'Coordinates Locked', 
        toast: true, 
        position: 'top-end', 
        showConfirmButton: false, 
        timer: 3000,
        background: '#fdfcf0'
      });
    }, () => {
      Swal.close();
      Swal.fire('Failed', 'GPS signal blocked by the vault.', 'error');
    });
  };

  const handleAction = async (type) => {
    const isBorrow = type === 'borrow';
    const endpoint = isBorrow ? '/borrow' : '/books';
    const headers = { 
      'x-user-role': role, 
      ...(isBorrow && { 'x-user-id': forms.userId }) 
    };

    // Validasi dasar
    if (isBorrow && (!forms.userId || !forms.bookId || !location)) {
      return Swal.fire('Protocol Error', 'User ID, Catalog ID, and Geolocation are mandatory!', 'warning');
    }

    const payload = isBorrow 
      ? { bookId: parseInt(forms.bookId), latitude: location?.lat, longitude: location?.lng }
      : { title: forms.title, author: forms.author, stock: parseInt(forms.stock) };

    try {
      await axios.post(`${API_URL}${endpoint}`, payload, { headers });
      Swal.fire({ 
        icon: 'success', 
        title: isBorrow ? 'Borrowing Sealed!' : 'New Tome Registered!', 
        confirmButtonColor: '#1e1a17',
        background: '#fdfcf0'
      });
      // Bersihkan form setelah sukses
      setForms({ title: '', author: '', stock: '', userId: '', bookId: '' });
      fetchAllData();
    } catch (err) { 
      Swal.fire('Access Denied', err.response?.data?.message || 'The archive is currently protected.', 'error'); 
    }
  };

  return (
    <div className="container-pro">
      {/* HEADER NAVIGASI */}
      <Navbar role={role} setRole={setRole} />
      
      {/* SECTION 1: CONTROL PANEL (CENTERED) */}
      <section className="central-control-panel">
        <AnimatePresence mode="wait">
          <motion.div 
            key={role} 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4 }}
            className="form-wrapper-centric"
          >
            {role === 'admin' ? (
              <AdminPanel forms={forms} setForms={setForms} handleAction={handleAction} />
            ) : (
              <UserPanel 
                forms={forms} 
                setForms={setForms} 
                location={location} 
                getLocation={getLocation} 
                handleAction={handleAction} 
                ChangeView={ChangeView} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* SECTION 2: THE ROYAL LEDGER (LOGS) - FULL WIDTH */}
      {role === 'admin' && (
        <section className="royal-ledger-section">
          <BorrowLogs logs={logs} />
        </section>
      )}

      {/* SECTION 3: INVENTORY LIST */}
      <main className="archive-collection-section">
        <div className="inventory-header">
          <h4 style={{ color: 'var(--accent-gold)', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Est. 2026 Archive
          </h4>
          <h2>The Grand Archive</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <button onClick={fetchAllData} className="refresh-btn" title="Sync with Celestial Archive">
              <RefreshCcw size={28} />
            </button>
          </div>
        </div>

        {/* --- UI SEARCH BAR --- */}
        <div className="search-container">
          <div className="search-wrapper">
            <Search className="search-icon-inside" size={20} />
            <input 
              type="text" 
              className="input-search"
              placeholder="Search by ID, Title, or Author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="books-grid">
          {books.length > 0 ? (
            books.map(book => <BookCard key={book.id} book={book} />)
          ) : (
            <div className="empty-state">
              <ScrollText size={80} color="var(--accent-gold)" style={{ opacity: 0.2, marginBottom: '20px' }} />
              <h3 style={{ fontFamily: 'Cinzel', fontSize: '1.5rem', color: 'var(--wood-medium)' }}>
                No sacred tomes discovered yet...
              </h3>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER DECORATION */}
      <footer style={{ textAlign: 'center', padding: '40px', opacity: 0.4, fontSize: '0.8rem', letterSpacing: '2px' }}>
        &copy; 2026 THE GRAND ARCHIVE PROTOCOL · PREMIUM ACCESS
      </footer>
    </div>
  );
}

export default App;