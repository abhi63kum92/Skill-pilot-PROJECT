import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IntelligenceProvider } from './context/IntelligenceContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CompetencyProfile from './pages/CompetencyProfile';
import LearningPath from './pages/LearningPath';
import MCQGenerator from './pages/MCQGenerator';
import QuizTake from './pages/QuizTake';
import CourseCatalog from './pages/CourseCatalog';
import AdminDashboard from './pages/AdminDashboard';
import VirtualLab from './pages/VirtualLab';
import Certificates from './pages/Certificates';
import IgotHub from './pages/IgotHub';
import './App.css';

/** Shown while JWT session is being restored from server */
function AuthLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: '48px', height: '48px',
        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
        borderRadius: '12px',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      <p style={{ color: '#475569', fontSize: '0.9rem' }}>Restoring your session…</p>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.95)} }`}</style>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoader />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <IntelligenceProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#16161f',
                  color: '#f1f5f9',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '12px',
                },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<CompetencyProfile />} />
                <Route path="learning-path" element={<LearningPath />} />
                <Route path="courses" element={<CourseCatalog />} />
                <Route path="mcq-generator" element={<MCQGenerator />} />
                <Route path="quiz/:quizId" element={<QuizTake />} />
                <Route path="lab" element={<VirtualLab />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="igot-hub" element={<IgotHub />} />
                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </IntelligenceProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
