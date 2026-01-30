import React from 'react';
import { MapPin, BookmarkPlus, UserCheck, Hash } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Icon Leaflet yang sering tidak muncul
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UserPanel = ({ forms, setForms, location, getLocation, handleAction, ChangeView }) => {
  return (
    <div className="form-section">
      <h2><BookmarkPlus color="var(--accent-gold)" /> Borrow a Sacred Tome</h2>
      
      {/* Input User ID / Reader ID */}
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          placeholder="Your Reader ID (e.g. 101)"
          value={forms.userId}
          onChange={(e) => setForms({ ...forms, userId: e.target.value })}
        />
        <UserCheck size={18} style={{ position: 'absolute', right: '20px', top: '20px', opacity: 0.3 }} />
      </div>

      {/* Input Book Catalog ID */}
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          placeholder="Book Catalog ID (e.g. 1)"
          value={forms.bookId}
          onChange={(e) => setForms({ ...forms, bookId: e.target.value })}
        />
        <Hash size={18} style={{ position: 'absolute', right: '20px', top: '20px', opacity: 0.3 }} />
      </div>

      {/* Geolocation Trigger */}
      <button className="btn-action btn-detect" onClick={getLocation}>
        <MapPin size={20} /> {location ? "Location Authenticated" : "Verify My Location"}
      </button>

      {/* Preview Map yang Mewah */}
      {location && (
        <div style={{ height: '200px', borderRadius: '25px', overflow: 'hidden', marginBottom: '25px', border: '2px solid var(--accent-gold)' }}>
          <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here, ready to borrow.</Popup>
            </Marker>
            <ChangeView center={[location.lat, location.lng]} />
          </MapContainer>
        </div>
      )}

      {/* Tombol Eksekusi Peminjaman */}
      <button 
        className="btn-action btn-user" 
        onClick={() => handleAction('borrow')}
      >
        Authorize Borrowing
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '20px', opacity: 0.5, letterSpacing: '1px' }}>
        BY AUTHORIZING, YOU AGREE TO THE GRAND ARCHIVE TERMS.
      </p>
    </div>
  );
};

export default UserPanel;