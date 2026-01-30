import React from 'react';
import { motion } from 'framer-motion';
import { History, MapPin, User, BookOpen, Calendar, Hash, Globe, ScrollText } from 'lucide-react';
import '../Ledger.css';

const BorrowLogs = ({ logs }) => {
  return (
    <div className="ledger-full-width">
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="ledger-wrapper"
      >
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '45px' }}>
          <div className="logo-icon">
            <History size={28} />
          </div>
          <div>
            <h4 style={{ color: 'var(--accent-gold)', letterSpacing: '5px', margin: 0, fontSize: '0.8rem', fontWeight: '900' }}>
              CHRONICLES
            </h4>
            <h2 style={{ fontFamily: 'Cinzel', margin: 0, fontSize: '2.5rem', color: 'var(--wood-dark)' }}>
              The Royal Ledger
            </h2>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-responsive">
          <table className="royal-table">
            <thead>
              <tr>
                <th><Hash size={15} style={{ marginRight: '8px' }} /> ID</th>
                <th><User size={15} style={{ marginRight: '8px' }} /> Reader</th>
                <th><BookOpen size={15} style={{ marginRight: '8px' }} /> Sacred Tome</th>
                <th><Globe size={15} style={{ marginRight: '8px' }} /> Location</th>
                <th><Calendar size={15} style={{ marginRight: '8px' }} /> Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {/* Pastikan logs ada dan berupa array sebelum mapping */}
              {Array.isArray(logs) && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: '900', color: 'var(--accent-gold)', width: '100px' }}>
                      #{log.id}
                    </td>
                    <td className="user-cell">
                      Member {log.userId || "Unknown"}
                    </td>
                    <td className="book-cell" style={{ fontFamily: 'Marcellus, serif', fontSize: '1.1rem' }}>
                      {log.Book?.title || `Catalogue ID: ${log.bookId}`}
                    </td>
                    <td>
                      <a 
                        href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="map-link"
                      >
                        <MapPin size={14} /> 
                        <span>{log.latitude?.toFixed(4)}, {log.longitude?.toFixed(4)}</span>
                      </a>
                    </td>
                    <td style={{ color: '#8C7B6E', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString('id-ID') : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '80px' }}>
                    <div style={{ opacity: 0.3 }}>
                      <ScrollText size={60} style={{ marginBottom: '15px', margin: '0 auto' }} />
                      <p style={{ fontFamily: 'Cinzel', fontSize: '1.2rem' }}>Archive is currently vacant...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default BorrowLogs;