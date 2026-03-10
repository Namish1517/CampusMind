import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        await signup(formData.name, formData.email, formData.password);
        // auto-login after signup just in case
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <motion.div 
        className="auth-form glass-panel"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1>{isLogin ? 'Welcome Back' : 'Join CampusMind'}</h1>
        <p className="subtitle">
          {isLogin ? 'Log in to continue your journey' : 'A safe space for your thoughts'}
        </p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <motion.div 
              className="form-group"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
            >
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="How should we call you?"
                required={!isLogin}
                value={formData.name}
                onChange={handleChange}
              />
            </motion.div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="you@campus.edu"
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up here' : 'Log in here'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
