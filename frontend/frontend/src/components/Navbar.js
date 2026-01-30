import React from 'react';
import { motion } from 'framer-motion';
import { Book as BookIcon, User, Shield } from 'lucide-react';

const Navbar = ({ role, setRole }) => (
  <motion.nav initial={{ y: -30 }} animate={{ y: 0 }} className="glass-card nav-pro">
    <div className="nav-logo">
      <div className="logo-icon"><BookIcon size={28} /></div>
      <span>The Grand <span style={{color: 'var(--accent)'}}>Archive</span></span>
    </div>
    <div className="role-switcher">
      <button onClick={() => setRole('user')} className={`role-btn ${role === 'user' ? 'active' : ''}`}>
        <User size={16} /> USER
      </button>
      <button onClick={() => setRole('admin')} className={`role-btn ${role === 'admin' ? 'active' : ''}`}>
        <Shield size={16} /> ADMIN
      </button>
    </div>
  </motion.nav>
);
export default Navbar;