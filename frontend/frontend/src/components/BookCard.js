import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, Hash, Layers, Sparkles } from 'lucide-react';

const BookCard = ({ book }) => {
  // Cegah error jika book undefined atau null
  if (!book) return null;

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        y: -20, 
        scale: 1.03,
        transition: { duration: 0.4, ease: "easeOut" } 
      }}
      className="glass-card book-card"
    >
      {/* Header Kartu: Status & Stok */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px', 
          color: 'var(--accent-gold)', 
          fontSize: '0.65rem', 
          fontWeight: '900',
          letterSpacing: '2px'
        }}>
          <Sparkles size={12} />
          <span>PREMIUM ARCHIVE</span>
        </div>
        
        <div className="badge-stock">
          <Layers size={12} style={{marginRight: '6px'}} /> 
          {/* GUNAKAN OPTIONAL CHAINING AGAR TIDAK ERROR */}
          {book?.stock ?? 0} IN STOCK
        </div>
      </div>

      {/* Judul Buku */}
      <h3 className="book-title" style={{ 
        textAlign: 'center', 
        minHeight: '70px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '1.8rem',
        fontWeight: '900',
        lineHeight: '1.1'
      }}>
        {book?.title || "Untitled Scroll"}
      </h3>
      
      {/* Informasi Detail Buku */}
      <div style={{ 
        marginTop: '25px', 
        padding: '15px', 
        background: 'rgba(212, 175, 55, 0.05)', 
        borderRadius: '20px',
        border: '1px solid rgba(212, 175, 55, 0.1)'
      }}>
        {/* Penulis */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--wood-dark)' }}>
          <User size={16} color="var(--accent-gold)" />
          <span style={{ 
            fontWeight: '700', 
            fontSize: '1rem',
            fontFamily: 'Marcellus, serif'
          }}>
            {book?.author || "Unknown Sage"}
          </span>
        </div>

        {/* Catalog ID */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginTop: '10px', 
          fontSize: '0.7rem', 
          opacity: 0.6,
          letterSpacing: '1px',
          fontWeight: '600'
        }}>
          <Hash size={12} />
          <span>UUID-ARCH-{book?.id || "000"}2026</span>
        </div>
      </div>

      {/* Ikon Latar Belakang */}
      <BookOpen 
        className="card-bg-icon" 
        size={120} 
        style={{ 
          position: 'absolute', 
          bottom: '-25px', 
          right: '-25px', 
          opacity: 0.06, 
          transform: 'rotate(-15deg)',
          pointerEvents: 'none'
        }} 
      />
    </motion.div>
  );
};

export default BookCard;