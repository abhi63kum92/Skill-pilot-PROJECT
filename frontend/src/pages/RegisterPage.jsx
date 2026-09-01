import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, UserPlus, Landmark, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const departments = [
  'National Statistical Office (NSO)',
  'Data Informatics and Innovation Division (DIID)',
  'Survey Design and Research Division (SDRD)',
  'Field Operations Division (FOD)',
  'National Accounts Division (NAD)',
  'Economic Statistics Division (ESD)',
  'State DES (Directorate of Economics & Statistics)',
  'Other'
];
const designations = [
  'Junior Statistical Officer',
  'Statistical Officer',
  'Field Investigator',
  'Data Scientist',
  'Director'
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'password123',
    designation: 'Statistical Officer',
    department: 'Survey Design and Research Division (SDRD)',
    experience: 2,
    qualification: 'M.Sc Statistics / Data Science',
    currentAssignment: 'Survey Data Processing & CPI Indexing',
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(form);
    if (!result.success) {
      toast.error(result.error || 'Registration failed.');
      setLoading(false);
      return;
    }
    toast.success('Officer profile registered! Let\'s assess your competency matrix.');
    navigate('/profile');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 12s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated blobs */}
      <div style={{
        position: 'fixed', top: '-120px', right: '-120px',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', filter: 'blur(70px)',
        animation: 'blob1 9s ease-in-out infinite', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-100px', left: '-100px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'rgba(255,200,100,0.1)', filter: 'blur(60px)',
        animation: 'blob2 11s ease-in-out infinite', pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes blob1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.08); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.06); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reg-card { animation: fadeInUp 0.6s ease forwards; }
        .reg-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          font-size: 0.875rem;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }
        .reg-input:focus {
          border-color: #7c3aed;
          background: rgba(255,255,255,0.88);
          box-shadow: 0 0 0 4px rgba(124,58,237,0.15);
        }
        .reg-input::placeholder { color: #94a3b8; }
        .reg-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.82);
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .reg-select {
          width: 100%;
          padding: 11px 14px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(10px);
          font-size: 0.875rem;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
          cursor: pointer;
          appearance: auto;
        }
        .reg-select:focus {
          border-color: #7c3aed;
          background: rgba(255,255,255,0.88);
          box-shadow: 0 0 0 4px rgba(124,58,237,0.15);
        }
        .reg-btn-primary {
          padding: 13px 28px;
          background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
          font-family: 'Space Grotesk', sans-serif;
        }
        .reg-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.5);
        }
        .reg-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .reg-btn-ghost {
          padding: 13px 20px;
          background: rgba(255,255,255,0.18);
          color: white;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 14px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s, transform 0.2s;
          font-family: 'Space Grotesk', sans-serif;
          backdrop-filter: blur(8px);
        }
        .reg-btn-ghost:hover {
          background: rgba(255,255,255,0.28);
          transform: translateY(-1px);
        }
        .reg-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .reg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .reg-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reg-card" style={{
        width: '100%', maxWidth: '780px',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(28px)',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.35)',
        padding: '44px 48px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
          <div style={{
            width: '50px', height: '50px', flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(124,58,237,0.45)',
          }}>
            <Landmark size={24} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.5rem', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800, color: 'white', margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              Create Official Officer Profile
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Enter your official posting details for AI FRAC competency benchmarking.
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px',
          background: 'rgba(255,255,255,0.12)', borderRadius: '100px',
          padding: '8px 16px', width: 'fit-content',
          border: '1px solid rgba(255,255,255,0.25)',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>🇮🇳 MoSPI Officer Registration</span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>• Step 1 of 2</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="reg-grid" style={{ marginBottom: '16px' }}>
            <div>
              <label className="reg-label">Full Name</label>
              <input className="reg-input" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ramesh Chandra" required />
            </div>
            <div>
              <label className="reg-label">Government Email</label>
              <input className="reg-input" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="name@mospi.gov.in" required />
            </div>
            <div>
              <label className="reg-label">Password</label>
              <input className="reg-input" type="password" value={form.password} onChange={e => update('password', e.target.value)} required />
            </div>
            <div>
              <label className="reg-label">Designation / Role Target</label>
              <select className="reg-select" value={form.designation} onChange={e => update('designation', e.target.value)}>
                {designations.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="reg-label">Department / Division</label>
              <select className="reg-select" value={form.department} onChange={e => update('department', e.target.value)}>
                {departments.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="reg-label">Experience (Years)</label>
              <input className="reg-input" type="number" min="0" value={form.experience} onChange={e => update('experience', e.target.value)} />
            </div>
            <div>
              <label className="reg-label">Highest Qualification</label>
              <input className="reg-input" value={form.qualification} onChange={e => update('qualification', e.target.value)} placeholder="M.Sc Statistics / Data Analytics" />
            </div>
            <div>
              <label className="reg-label">Current Statistical Assignment</label>
              <input className="reg-input" value={form.currentAssignment} onChange={e => update('currentAssignment', e.target.value)} placeholder="CPI, NSS, SDG, Data Processing..." />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '28px' }}>
            <button type="button" className="reg-btn-ghost" onClick={() => navigate('/login')}>
              <ArrowLeft size={16} /> Back to Login
            </button>
            <button className="reg-btn-primary" type="submit" disabled={loading}>
              {loading
                ? <span className="reg-spinner" />
                : <><UserPlus size={16} /> Register & Begin Assessment <ChevronRight size={16} /></>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
