import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, UserPlus, Zap } from 'lucide-react';
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
    toast.success('Officer profile registered in SQLite! Let\'s assess your competency matrix.');
    navigate('/profile');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '760px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem' }}>Create Official Officer Profile</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Enter your official posting details for AI FRAC competency benchmarking.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ marginBottom: '16px' }}>
            <div>
              <label className="input-label">Full Name</label>
              <input className="input-field" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Ramesh Chandra" required />
            </div>
            <div>
              <label className="input-label">Government Email</label>
              <input className="input-field" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="name@mospi.gov.in" required />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input className="input-field" type="password" value={form.password} onChange={e => update('password', e.target.value)} required />
            </div>
            <div>
              <label className="input-label">Designation / Role Target</label>
              <select className="select-field" value={form.designation} onChange={e => update('designation', e.target.value)}>
                {designations.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Department / Division</label>
              <select className="select-field" value={form.department} onChange={e => update('department', e.target.value)}>
                {departments.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Experience (Years)</label>
              <input className="input-field" type="number" min="0" value={form.experience} onChange={e => update('experience', e.target.value)} />
            </div>
            <div>
              <label className="input-label">Highest Qualification</label>
              <input className="input-field" value={form.qualification} onChange={e => update('qualification', e.target.value)} placeholder="M.Sc Statistics / Data Analytics" />
            </div>
            <div>
              <label className="input-label">Current Statistical Assignment</label>
              <input className="input-field" value={form.currentAssignment} onChange={e => update('currentAssignment', e.target.value)} placeholder="CPI, NSS, SDG, Data Processing..." />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/login')}>Back to Login</button>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : <><UserPlus size={16} /> Register & Begin Assessment <ChevronRight size={16} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
