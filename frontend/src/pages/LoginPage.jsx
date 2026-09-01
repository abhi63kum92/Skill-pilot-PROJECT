import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ChevronRight, Landmark, Target, CheckCircle2, BookOpen, Brain, BarChart3, Sparkles, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}! 🎉`);
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials. Try demo accounts below.');
    }
    setLoading(false);
  };

  const features = [
    { text: 'AI Competency Mapping', icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { text: '1200+ iGOT Courses', icon: BookOpen, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { text: 'MCQ Generator from PDFs', icon: Brain, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { text: 'Real-time Analytics', icon: BarChart3, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 12s ease infinite',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', top: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)', filter: 'blur(60px)',
        animation: 'blob1 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', right: '-80px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', filter: 'blur(60px)',
        animation: 'blob2 10s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '45%',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'rgba(255,200,100,0.1)', filter: 'blur(50px)',
        animation: 'blob3 7s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes blob1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.1); }
          66% { transform: translate(-20px, 50px) scale(0.9); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-30px, -40px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .login-card { animation: fadeInUp 0.6s ease forwards; }
        .feature-item {
          animation: slideInRight 0.5s ease forwards;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feature-item:hover {
          transform: translateX(6px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
        }
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          font-size: 1rem;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .login-input:focus {
          border-color: #7c3aed;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 0 0 4px rgba(124,58,237,0.15);
        }
        .login-input::placeholder { color: #94a3b8; }
        .login-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.85);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.02em;
          -webkit-tap-highlight-color: transparent;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.5);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .login-spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── MOBILE RESPONSIVE ── */
        .login-right-panel { display: flex; }
        .login-left-panel { padding: 40px 60px; }
        .login-inner-card { padding: 48px 40px; }

        @media (max-width: 768px) {
          .login-right-panel { display: none !important; }
          .login-left-panel {
            padding: 24px 16px !important;
            width: 100% !important;
          }
          .login-inner-card {
            padding: 32px 24px !important;
            border-radius: 20px !important;
            max-width: 100% !important;
          }
          .login-welcome-title {
            font-size: 1.6rem !important;
          }
          .login-demo-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .login-left-panel { padding: 16px 12px !important; }
          .login-inner-card { padding: 28px 20px !important; }
        }
      `}</style>

      {/* Left panel - Form */}
      <div className="login-left-panel" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px 60px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div className="login-card login-inner-card" style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(24px)',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.35)',
          padding: '48px 40px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)',
          boxSizing: 'border-box',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
            <div style={{
              width: '46px', height: '46px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(124,58,237,0.5)',
            }}>
              <Landmark size={22} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>SkillPilot</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: '0.12em' }}>AI LEARNING PLATFORM</div>
            </div>
          </div>

          <h1 className="login-welcome-title" style={{
            fontSize: '1.9rem', fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800, marginBottom: '6px', color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            Welcome back 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', marginBottom: '32px', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Sign in with your Government credentials to access your personalized learning journey.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label className="login-label">Government Email ID</label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@mospi.gov.in"
                required
              />
            </div>

            <div>
              <label className="login-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="login-input"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: '46px' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px',
                }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" style={{ marginTop: '4px' }} disabled={loading}>
              {loading ? <span className="login-spinner" /> : <><Shield size={17} /> Sign In <ChevronRight size={17} /></>}
            </button>

            {/* Quick Demo Autofill Buttons */}
            <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={13} color="#fde68a" /> ONE-CLICK DEMO ACCOUNTS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => { setEmail('officer@mospi.gov.in'); setPassword('password123'); toast.success('Officer credentials filled!'); }}
                  style={{
                    padding: '6px 4px', fontSize: '0.74rem', fontWeight: 600,
                    background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px', color: 'white', cursor: 'pointer'
                  }}
                >
                  👤 Officer
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@mospi.gov.in'); setPassword('admin123'); toast.success('Admin credentials filled!'); }}
                  style={{
                    padding: '6px 4px', fontSize: '0.74rem', fontWeight: 600,
                    background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px', color: 'white', cursor: 'pointer'
                  }}
                >
                  ⚡ Admin
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('trainee@mospi.gov.in'); setPassword('password123'); toast.success('Trainee credentials filled!'); }}
                  style={{
                    padding: '6px 4px', fontSize: '0.74rem', fontWeight: 600,
                    background: 'rgba(16,185,129,0.3)', border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px', color: 'white', cursor: 'pointer'
                  }}
                >
                  🌱 Trainee
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', paddingTop: '4px' }}>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>New Officer / User? </span>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  background: 'none', border: 'none', color: 'white',
                  fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                  textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.5)',
                }}
              >
                Create Officer Profile & Assess Skills
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right panel - decorative (hidden on mobile) */}
      <div className="login-right-panel" style={{
        flex: 1, flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px', position: 'relative',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          {/* Icon */}
          <div style={{
            width: '90px', height: '90px', margin: '0 auto 28px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
          }}>
            <Target size={44} color="white" />
          </div>

          <h2 style={{
            fontSize: '1.8rem', fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800, marginBottom: '14px', color: 'white',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}>
            Bridge Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #fde68a, #fbbf24)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Skill Gap</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontSize: '0.92rem', marginBottom: '36px' }}>
            AI-powered competency assessment tailored for India's statistical workforce. Get personalized learning paths from iGOT Karmayogi in minutes.
          </p>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => (
              <div key={i} className="feature-item" style={{
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '14px', fontSize: '0.9rem',
                color: 'white', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '14px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: f.bg, backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0,
                }}>
                  <f.icon size={18} color={f.color} />
                </div>
                <span style={{ fontWeight: 600, letterSpacing: '0.01em' }}>{f.text}</span>
                <Sparkles size={14} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto' }} />
              </div>
            ))}
          </div>

          {/* India badge */}
          <div style={{
            marginTop: '28px', display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
            borderRadius: '100px', padding: '8px 20px',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <span style={{ fontSize: '1.1rem' }}>🇮🇳</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600 }}>
              MoSPI × iGOT Karmayogi Initiative
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
