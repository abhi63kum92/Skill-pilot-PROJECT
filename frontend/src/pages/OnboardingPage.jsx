import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useIntelligence } from '../context/IntelligenceContext';
import { assessCompetencies } from '../services/api';

const framework = {
  Statistical: ['Survey Design', 'Sampling Methods', 'National Accounts', 'Price Statistics', 'SDG Indicators', 'Metadata Standards', 'Data Quality'],
  Technical: ['Python', 'R Language', 'SQL', 'GIS', 'Data Visualization', 'AI/ML Basics', 'Cloud Computing', 'APIs & Integration'],
  'Digital Governance': ['Cybersecurity', 'Data Privacy', 'Digital Signatures', 'Government Cloud', 'Digital Public Infrastructure', 'Open Data'],
  Behavioural: ['Leadership', 'Communication', 'Project Management', 'Ethics & Integrity', 'Decision Making', 'Change Management'],
};

const labels = { 0: 'None', 1: 'Beginner', 2: 'Working', 3: 'Advanced', 4: 'Expert' };

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { updateAssessment } = useIntelligence();
  const [loading, setLoading] = useState(false);
  const [competencies, setCompetencies] = useState(() => Object.fromEntries(
    Object.entries(framework).map(([domain, skills]) => [domain, Object.fromEntries(skills.map(skill => [skill, 1]))])
  ));

  const setLevel = (domain, skill, level) => {
    setCompetencies(prev => ({ ...prev, [domain]: { ...prev[domain], [skill]: level } }));
  };

  const submit = async () => {
    setLoading(true);
    const profile = {
      designation: user?.designation || 'Statistical Officer',
      department: user?.department || 'NSO',
      experience: user?.experience || 1,
      qualification: user?.qualification || 'Graduate',
      currentAssignment: user?.currentAssignment || 'General Statistics',
    };
    try {
      if (user?.email) {
        localStorage.setItem(`skillpilot_comp_${user.email}`, JSON.stringify(competencies));
      }
      const result = await assessCompetencies(profile, competencies);
      updateAssessment(result);
      updateUser({ onboarded: true, competencies });
      toast.success('AI Assessment completed! Your personalized learning path is ready.');
      navigate('/dashboard');
    } catch {
      toast.error('Unable to compute assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <h1 className="page-title">Initial Competency Assessment</h1>
        <p className="page-subtitle">Rate your current skill level. The AI engine will compare it with your role requirements.</p>
      </div>

      <div className="card card-glow" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Brain size={24} color="#818cf8" />
          <div>
            <div style={{ fontWeight: 700 }}>{user?.name} · {user?.designation}</div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{user?.department} · {user?.experience} years · {user?.currentAssignment || 'Assignment not specified'}</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {Object.entries(framework).map(([domain, skills]) => (
          <div key={domain} className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>{domain}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {skills.map(skill => (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{skill}</span>
                    <span style={{ fontSize: '0.74rem', color: '#818cf8' }}>{labels[competencies[domain][skill]]}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                    {[0, 1, 2, 3, 4].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setLevel(domain, skill, level)}
                        style={{
                          height: '28px',
                          borderRadius: '8px',
                          border: competencies[domain][skill] === level ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                          background: competencies[domain][skill] === level ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.03)',
                          color: competencies[domain][skill] === level ? '#f1f5f9' : '#64748b',
                          cursor: 'pointer',
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button className="btn btn-primary btn-lg" onClick={submit} disabled={loading}>
          <Save size={18} /> {loading ? 'Generating Path...' : 'Generate My AI Learning Path'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
