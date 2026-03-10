import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const moods = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Anxious', emoji: '😰' },
  { label: 'Angry', emoji: '😡' },
  { label: 'Neutral', emoji: '😐' }
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMoodData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        api.get(`/mood/history/${user._id}`),
        api.get(`/mood/stats/${user._id}`)
      ]);
      // Reverse history for most recent first if backend doesn't sort
      setHistory(historyRes.data.reverse());
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch mood data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMoodData();
    }
  }, [user]);

  const handleLogMood = async () => {
    if (!selectedMood) return;

    try {
      await api.post('/mood/add', {
        userId: user._id,
        mood: selectedMood,
        note
      });
      
      setSelectedMood(null);
      setNote('');
      fetchMoodData(); // Refresh data
    } catch (error) {
      console.error('Failed to log mood', error);
    }
  };

  const getEmoji = (label) => {
    return moods.find(m => m.label === label)?.emoji || '🧠';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Welcome back, {user?.name || 'Student'} 👋</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>How are you feeling today?</p>
      </div>

      <div className="dashboard-grid">
        <div className="left-column">
          <div className="card" style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Log Your Mood</h2>
            <div className="mood-selector">
              {moods.map((m) => (
                <button 
                  key={m.label}
                  className={`mood-btn ${selectedMood === m.label ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(m.label)}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>

            {selectedMood && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ overflow: 'hidden', marginTop: '16px' }}
              >
                <textarea 
                  placeholder="Why do you feel this way? (Optional)"
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ marginBottom: '16px' }}
                />
                <button onClick={handleLogMood}>
                  Save Entry
                </button>
              </motion.div>
            )}
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>Your Mood Breakdown</h2>
            {Object.keys(stats).length === 0 ? (
              <p className="empty-state" style={{ padding: '20px' }}>Log some moods to see your stats.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {Object.entries(stats).map(([mood, count]) => (
                  <div key={mood} style={{ 
                    padding: '12px 20px', 
                    background: 'var(--secondary-color)', 
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{getEmoji(mood)}</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>{mood}</div>
                      <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{count} logs</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="card" style={{ height: '100%' }}>
            <h2>Recent History</h2>
            <div className="mood-history-list">
              {loading && <p>Loading history...</p>}
              {!loading && history.length === 0 && (
                <p className="empty-state">No recent activity.</p>
              )}
              {!loading && history.map((entry) => (
                <motion.div 
                  key={entry._id} 
                  className="mood-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="mood-emoji">
                    {getEmoji(entry.mood)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{entry.mood}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      {new Date(entry.createdAt).toLocaleDateString(undefined, { 
                        weekday: 'short', month: 'short', day: 'numeric' 
                      })}
                    </div>
                    {entry.note && (
                      <div style={{ marginTop: '8px', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        "{entry.note}"
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
