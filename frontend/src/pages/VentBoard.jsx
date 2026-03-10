import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send } from 'lucide-react';

export default function VentBoard() {
  const [vents, setVents] = useState([]);
  const [newVent, setNewVent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVents = async () => {
    try {
      const res = await api.get('/vent/all');
      setVents(res.data);
    } catch (error) {
      console.error('Failed to fetch vents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVents();
  }, []);

  const handlePostVent = async (e) => {
    e.preventDefault();
    if (!newVent.trim()) return;
    
    try {
      const res = await api.post('/vent/add', { text: newVent });
      // Add the new vent to top of list
      setVents([res.data.post, ...vents]);
      setNewVent('');
    } catch (error) {
      console.error('Failed to post vent', error);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await api.post(`/vent/like/${id}`);
      setVents(vents.map(v => v._id === id ? { ...v, likes: res.data.likes } : v));
    } catch (error) {
      console.error('Failed to like post', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="vent-header">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Anonymous Vent Board</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Got something on your mind? Share it anonymously with the community.
          This is a zero-judgment zone.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handlePostVent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <textarea 
            placeholder="What's weighing on you today?"
            rows="4"
            value={newVent}
            onChange={(e) => setNewVent(e.target.value)}
            style={{ resize: 'none' }}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={!newVent.trim()}>
              <Send size={18} /> Publish Anonymously
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>Loading vents...</div>
      ) : (
        <div className="vent-list">
          <AnimatePresence>
            {vents.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <p>No vents entirely. Be the first to express yourself.</p>
              </div>
            ) : (
              vents.map((vent) => (
                <motion.div 
                  key={vent._id}
                  className="card vent-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <div className="vent-text">
                    "{vent.text}"
                  </div>
                  <div className="vent-footer">
                    <span className="vent-date">
                      {new Date(vent.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <button 
                      className="vent-like-btn" 
                      onClick={() => handleLike(vent._id)}
                    >
                      <Heart size={16} style={{ marginRight: '6px', verticalAlign: '-3px' }} />
                      {vent.likes || 0}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
