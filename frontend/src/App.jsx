import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import VentBoard from './pages/VentBoard';
import MentalHealthGuide from './pages/MentalHealthGuide';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container" style={{ flex: 1, paddingBottom: '40px' }}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/vent" element={
              <ProtectedRoute>
                <VentBoard />
              </ProtectedRoute>
            } />
            <Route path="/guide" element={
              <ProtectedRoute>
                <MentalHealthGuide />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
