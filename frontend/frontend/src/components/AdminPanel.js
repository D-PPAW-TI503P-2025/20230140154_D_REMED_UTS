import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus } from 'lucide-react';

const AdminPanel = ({ forms, setForms, handleAction }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card form-section">
    <h2><Shield size={22} /> Librarians Desk</h2>
    <input placeholder="Book Title" value={forms.title} onChange={e => setForms({...forms, title: e.target.value})} />
    <input placeholder="Author Name" value={forms.author} onChange={e => setForms({...forms, author: e.target.value})} />
    <input type="number" placeholder="Stok Count" value={forms.stock} onChange={e => setForms({...forms, stock: e.target.value})} />
    <button onClick={() => handleAction('add')} className="btn-action btn-admin"><Plus size={20} /> Register New Book</button>
  </motion.div>
);
export default AdminPanel;