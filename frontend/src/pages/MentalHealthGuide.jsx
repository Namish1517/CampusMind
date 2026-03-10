import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Info, PhoneCall, HeartPulse, CheckCircle2 } from 'lucide-react';

const questions = [
  { 
    id: 'stress', 
    text: 'Are you currently feeling severely stressed, anxious, or overwhelmed by your daily life or academics?' 
  },
  { 
    id: 'depression', 
    text: 'Do you frequently feel a persistent sense of sadness, isolation, or a loss of interest in things you used to enjoy?' 
  },
  { 
    id: 'abuse', 
    text: 'Are you experiencing any form of physical, emotional, or verbal abuse from someone in your life?' 
  }
];

export default function MentalHealthGuide() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <HeartPulse size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Your Personal Wellness Guide</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Taking the first step by reflecting on how you feel is incredibly brave. 
          Answer a few quick questions so we can provide the right resources for you.
        </p>
      </div>

      {!showResults ? (
        <div className="card" style={{ padding: '40px' }}>
          {questions.map((q, index) => (
            <div key={q.id} style={{ 
              marginBottom: index === questions.length - 1 ? '0' : '30px',
              paddingBottom: index === questions.length - 1 ? '0' : '30px',
              borderBottom: index === questions.length - 1 ? 'none' : '1px solid var(--border)'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '500' }}>
                {index + 1}. {q.text}
              </h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  className={`secondary ${answers[q.id] === true ? 'selected' : ''}`}
                  onClick={() => handleAnswer(q.id, true)}
                  style={{ 
                    flex: 1, 
                    background: answers[q.id] === true ? 'var(--primary-color)' : 'var(--surface)',
                    color: answers[q.id] === true ? '#fff' : 'var(--text-main)',
                    borderColor: answers[q.id] === true ? 'var(--primary-color)' : 'var(--border)'
                  }}
                >
                  Yes, I am
                </button>
                <button 
                  className={`secondary ${answers[q.id] === false ? 'selected' : ''}`}
                  onClick={() => handleAnswer(q.id, false)}
                  style={{ 
                    flex: 1,
                    background: answers[q.id] === false ? 'var(--text-main)' : 'var(--surface)',
                    color: answers[q.id] === false ? '#fff' : 'var(--text-main)',
                    borderColor: answers[q.id] === false ? 'var(--text-main)' : 'var(--border)'
                  }}
                >
                  No, I'm not
                </button>
              </div>
            </div>
          ))}

          <AnimatePresence>
            {allAnswered && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '40px', overflow: 'hidden' }}
              >
                <button 
                  onClick={() => setShowResults(true)} 
                  style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                >
                  View My Recommendations
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="results-container"
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* ABUSE RESPONSE (Highest Priority) */}
          {answers.abuse && (
            <div className="card" style={{ borderLeft: '6px solid #ef4444', background: '#fef2f2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <ShieldAlert color="#ef4444" size={32} />
                <h2 style={{ color: '#991b1b', margin: 0 }}>Immediate Support Required</h2>
              </div>
              <p style={{ color: '#7f1d1d', marginBottom: '20px', fontSize: '1.05rem' }}>
                <strong>You are not alone, and this is not your fault.</strong> If you are experiencing abuse, 
                your safety is the number one priority. Please reach out securely and immediately to professionals who can help navigate this.
              </p>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca' }}>
                  <div style={{ fontWeight: '600', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneCall size={18} /> National Domestic Violence Hotline
                  </div>
                  <div style={{ marginTop: '4px', color: '#7f1d1d' }}>Call 1-800-799-7233 or text "START" to 88788</div>
                </div>
                
                <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca' }}>
                  <div style={{ fontWeight: '600', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneCall size={18} /> Emergency Services
                  </div>
                  <div style={{ marginTop: '4px', color: '#7f1d1d' }}>Please call 911 if you are in immediate danger.</div>
                </div>
              </div>
            </div>
          )}

          {/* DEPRESSION RESPONSE */}
          {answers.depression && (
            <div className="card" style={{ borderLeft: '6px solid var(--primary-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Info color="var(--primary-color)" size={28} />
                <h2 style={{ margin: 0 }}>Navigating Sadness & Isolation</h2>
              </div>
              <p style={{ color: 'var(--text-main)', marginBottom: '16px' }}>
                Persistent sadness is heavy, but it doesn't have to be carried alone. Clinical depression and isolation are incredibly common, especially during stressful transition periods like college.
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><strong>Reach out to campus counseling:</strong> Universities often provide free, confidential therapy sessions.</li>
                <li><strong>Text the Crisis Line:</strong> Text HOME to 741741 to connect with a crisis counselor 24/7.</li>
                <li><strong>Break obligations down:</strong> On hard days, celebrate micro-victories (like drinking water, taking a shower).</li>
                <li><strong>Talk to someone:</strong> Vent on our anonymous Vent Board or speak to an advisor.</li>
              </ul>
            </div>
          )}

          {/* STRESS RESPONSE */}
          {answers.stress && (
            <div className="card" style={{ borderLeft: '6px solid var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <CheckCircle2 color="var(--text-main)" size={28} />
                <h2 style={{ margin: 0 }}>Managing Stress & Academic Burnout</h2>
              </div>
              <p style={{ color: 'var(--text-main)', marginBottom: '16px' }}>
                It looks like you're carrying a very heavy load. Prolonged stress can impair your health severely if not managed.
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><strong>Use the Pomodoro Technique:</strong> 25 minutes of focus, 5 minutes of rest. Never skip the rest.</li>
                <li><strong>Prioritize Sleep over Cramming:</strong> Your brain consolidates memory during sleep. Pulling all-nighters mathematically lowers test performance.</li>
                <li><strong>Step outside:</strong> A 15-minute walk without your phone can drastically reset your cortisol levels.</li>
              </ul>
            </div>
          )}

          {/* NO TO ALL */}
          {!answers.abuse && !answers.depression && !answers.stress && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <HeartPulse size={48} color="var(--primary-color)" style={{ margin: '0 auto 16px auto' }} />
              <h2>You're doing great!</h2>
              <p style={{ color: 'var(--text-light)', marginTop: '12px' }}>
                We're so glad to hear you aren't currently facing severe stress, isolation, or abuse. 
                Keep prioritizing your mental wellbeing. If you ever need to get something off your chest, 
                remember the Vent Area is always here for you.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="secondary" onClick={resetQuiz}>
              Retake Guide
            </button>
          </div>
          
        </motion.div>
      )}
    </motion.div>
  );
}
