import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('officer@mospi.gov.in');
  const [password, setPassword] = useState('password123');
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

  const demoLogins = [
    { email: 'officer@mospi.gov.in', pass: 'password123', name: 'Statistical Officer', badge: 'Learner', color: '#6366f1' },
    { email: 'admin@mospi.gov.in', pass: 'admin123', name: 'Director (Admin)', badge: 'Admin', color: '#06b6d4' },
    { email: 'trainee@mospi.gov.in', pass: 'password123', name: 'Junior Officer', badge: 'Learner', color: '#10b981' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#0a0a0f',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.04) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '420px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>SkillPilot</div>
              <div style={{ fontSize: '0.6rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.1em' }}>AI LEARNING PLATFORM</div>
            </div>
          </div>

          <h1 style={{ fontSize: '2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, marginBottom: '8px' }}>
            Welcome back 👋
          </h1>
          <p style={{ color: '#64748b', marginBottom: '36px', fontSize: '0.9rem' }}>
            Sign in with your Government credentials to access your personalized learning journey.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="input-label">Government Email ID</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@mospi.gov.in"
                required
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : <>Sign In <ChevronRight size={18} /></>}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>New Officer / User? </span>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Create Officer Profile & Assess Skills
              </button>
            </div>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: '36px' }}>
            <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎯 Demo Accounts (Click to auto-fill)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {demoLogins.map(d => (
                <div key={d.email}
                  onClick={() => { setEmail(d.email); setPassword(d.pass); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = d.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ width: '32px', height: '32px', background: `${d.color}20`, border: `1px solid ${d.color}40`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: d.color }}>
                    {d.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>{d.email}</div>
                  </div>
                  <span className="badge" style={{ background: `${d.color}15`, color: d.color }}>{d.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - decorative */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', maxWidth: '400px', position: 'relative' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '16px' }}>
            Bridge Your <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Skill Gap</span>
          </h2>
          <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '32px' }}>
            AI-powered competency assessment tailored for India's statistical workforce. Get personalized learning paths from iGOT Karmayogi in minutes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['✅ AI Competency Mapping', '📚 1200+ iGOT Courses', '🧠 MCQ Generator from PDFs', '📊 Real-time Analytics'].map(f => (
              <div key={f} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'left' }}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
