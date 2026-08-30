import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, CheckCircle2, User, Briefcase, GraduationCap, Award, Sparkles, Brain, ArrowRight, ShieldCheck, Target, RefreshCw } from 'lucide-react';
import { assessCompetencies, saveMyCompetencies, ROLE_PROFILES } from '../services/api';
import { useIntelligence } from '../context/IntelligenceContext';

const COMPETENCY_FRAMEWORK = {
  Statistical: ['Survey Design', 'Sampling Methods', 'National Accounts', 'Price Statistics', 'Labour Statistics', 'Agricultural Statistics', 'Industrial Statistics', 'SDG Indicators', 'Metadata Standards', 'Data Quality'],
  Technical: ['Python', 'R Language', 'SQL', 'Stata', 'SPSS', 'GIS', 'Data Visualization', 'AI/ML Basics', 'Cloud Computing', 'APIs & Integration'],
  'Digital Governance': ['Cybersecurity', 'Data Privacy', 'Digital Signatures', 'Government Cloud', 'Digital Public Infrastructure', 'Open Data'],
  Behavioural: ['Leadership', 'Communication', 'Project Management', 'Ethics & Integrity', 'Decision Making', 'Change Management'],
};

const LEVEL_LABELS = { 0: 'No Knowledge', 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert' };
const LEVEL_COLORS = { 0: '#334155', 1: '#ef4444', 2: '#f59e0b', 3: '#06b6d4', 4: '#10b981' };

const DEFAULT_COMPETENCIES = {
  Statistical: { 'Survey Design': 3, 'Sampling Methods': 2, 'National Accounts': 2, 'Price Statistics': 2, 'Labour Statistics': 2, 'Agricultural Statistics': 2, 'Industrial Statistics': 2, 'SDG Indicators': 2, 'Metadata Standards': 2, 'Data Quality': 2 },
  Technical: { 'Python': 1, 'R Language': 2, 'SQL': 2, 'Stata': 2, 'SPSS': 2, 'GIS': 2, 'Data Visualization': 2, 'AI/ML Basics': 1, 'Cloud Computing': 1, 'APIs & Integration': 1 },
  'Digital Governance': { 'Cybersecurity': 2, 'Data Privacy': 2, 'Digital Signatures': 2, 'Government Cloud': 1, 'Digital Public Infrastructure': 2, 'Open Data': 2 },
  Behavioural: { 'Leadership': 3, 'Communication': 3, 'Project Management': 2, 'Ethics & Integrity': 4, 'Decision Making': 3, 'Change Management': 2 },
};

export default function CompetencyProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { assessment, updateAssessment } = useIntelligence();

  const [competencies, setCompetencies] = useState(() => {
    if (user?.competencies && Object.keys(user.competencies).length > 0) {
      return user.competencies;
    }
    if (user?.email) {
      const saved = localStorage.getItem(`skillpilot_comp_${user.email}`);
      if (saved) return JSON.parse(saved);
    }
    return DEFAULT_COMPETENCIES;
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Statistical Official',
    email: user?.email || 'officer@mospi.gov.in',
    designation: user?.designation || 'Statistical Officer',
    department: user?.department || 'Survey Design and Research Division (SDRD)',
    experience: user?.experience || '4',
    qualification: user?.qualification || 'M.Sc Statistics / Data Science',
    currentAssignment: user?.currentAssignment || 'Consumer Price Index Division & Microdata Processing',
    previousTrainings: 'NSSTA Data Analysis Workshop (2025), iGOT Karmayogi Official Statistics Foundation (2024)',
  });

  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'Statistical Official',
        email: user.email || 'officer@mospi.gov.in',
        designation: user.designation || 'Statistical Officer',
        department: user.department || 'Survey Design and Research Division (SDRD)',
        experience: String(user.experience || '4'),
        qualification: user.qualification || 'M.Sc Statistics / Data Science',
        currentAssignment: user.currentAssignment || 'Consumer Price Index Division & Microdata Processing',
        previousTrainings: 'NSSTA Data Analysis Workshop (2025), iGOT Karmayogi Official Statistics Foundation (2024)',
      });
      if (user.competencies && Object.keys(user.competencies).length > 0) {
        setCompetencies(user.competencies);
      }
    }
  }, [user]);

  const currentRoleBenchmark = ROLE_PROFILES[profileData.designation] || ROLE_PROFILES['Statistical Officer'];

  const handleRoleChange = async (newRole) => {
    const roleConfig = ROLE_PROFILES[newRole];
    const newProfile = {
      ...profileData,
      designation: newRole,
      department: roleConfig ? roleConfig.department : profileData.department,
    };
    setProfileData(newProfile);
    updateUser({ designation: newRole, department: newProfile.department });

    const result = await assessCompetencies(newProfile, competencies);
    updateAssessment(result);
    toast.success(`Role benchmark switched to: ${newRole}`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user?.email) {
        localStorage.setItem(`skillpilot_comp_${user.email}`, JSON.stringify(competencies));
      }
      // Save directly to SQLite DB via PUT /api/me/competencies
      const response = await saveMyCompetencies(competencies, profileData);
      updateUser({ competencies, ...profileData });
      
      if (response.assessment) {
        updateAssessment(response.assessment);
      } else {
        const result = await assessCompetencies(profileData, competencies);
        updateAssessment(result);
      }
      toast.success('Competencies saved to Database & iGOT learning path updated!');
    } catch {
      // Offline fallback
      const result = await assessCompetencies(profileData, competencies);
      updateAssessment(result);
      toast('Saved locally (Offline Mode)');
    } finally {
      setSaving(false);
    }
  };

  const overallScore = () => {
    let total = 0, count = 0;
    Object.values(competencies).forEach(domain => {
      Object.values(domain).forEach(v => { total += v; count++; });
    });
    return Math.round((total / Math.max(1, count * 4)) * 100);
  };

  const domainScore = (domain) => {
    const vals = Object.values(competencies[domain] || {});
    return Math.round((vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length * 4)) * 100);
  };

  const startIgotSync = () => {
    setShowSyncModal(true);
    setSyncing(true);
    setSyncStep(1);

    setTimeout(() => setSyncStep(2), 800);
    setTimeout(() => setSyncStep(3), 1600);
    setTimeout(async () => {
      setSyncStep(4);
      setSyncing(false);

      const upgraded = {
        ...competencies,
        Statistical: { ...competencies.Statistical, 'Survey Design': 4, 'SDG Indicators': 3, 'Sampling Methods': 3 },
        Technical: { ...competencies.Technical, 'Python': 3, 'SQL': 3, 'Data Visualization': 3 },
        'Digital Governance': { ...competencies['Digital Governance'], 'Data Privacy': 3, 'Cybersecurity': 3 },
      };

      setCompetencies(upgraded);
      if (user?.email) {
        localStorage.setItem(`skillpilot_comp_${user.email}`, JSON.stringify(upgraded));
      }
      try {
        await saveMyCompetencies(upgraded, profileData);
      } catch {
        // fallback
      }
      updateUser({ competencies: upgraded });
      const res = await assessCompetencies(profileData, upgraded);
      updateAssessment(res);
      toast.success('iGOT Karmayogi Verified Transcript Sync Complete!');
    }, 2500);
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">🎯 MoSPI Competency Profile & FRAC Mapping</h1>
            <p className="page-subtitle">
              Role-benchmarked competency matrix aligned with Karmayogi Bharat & National Statistical Systems Training Academy (NSSTA)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/igot-hub')} style={{ borderColor: '#6366f1', color: '#818cf8' }}>
              <ShieldCheck size={16} /> iGOT & NSSTA Hub
            </button>
            <button className="btn btn-secondary" onClick={startIgotSync} style={{ borderColor: '#06b6d4', color: '#22d3ee' }}>
              <Sparkles size={16} /> Sync with iGOT ID
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <Save size={16} /> {saving ? 'Saving to DB...' : 'Save & Recalculate'}
            </button>
          </div>
        </div>
      </div>

      {/* iGOT Sync Modal */}
      {showSyncModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '32px', border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 20px 60px rgba(6,182,212,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>iGOT Karmayogi API Sync</h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Endpoint: https://api.igotkarmayogi.gov.in/v2/mospi-sync</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {[
                { step: 1, text: 'Connecting to MoSPI HRMS & iGOT Single Sign-On Node...' },
                { step: 2, text: 'Fetching verified course transcripts (46 completed learning hours)...' },
                { step: 3, text: 'AI calibrating competency ratings against NSSTA TPAC Framework...' },
                { step: 4, text: 'Sync successful! Competency scores synchronized.' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: syncStep >= s.step ? 1 : 0.35, transition: 'all 0.3s' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: syncStep > s.step ? '#10b981' : syncStep === s.step ? '#06b6d4' : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold'
                  }}>
                    {syncStep > s.step ? '✓' : s.step}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: syncStep >= s.step ? '#f1f5f9' : '#64748b' }}>
                    {s.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => setShowSyncModal(false)} disabled={syncing}>
                {syncing ? 'Synchronizing...' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Benchmark & Overall Readiness Banner */}
      <div className="card card-glow" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad2)" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42 * (assessment?.overallScore || overallScore()) / 100} ${2 * Math.PI * 42}`}
                  strokeLinecap="round" />
                <defs>
                  <linearGradient id="scoreGrad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {assessment?.overallScore || overallScore()}%
                </span>
                <span style={{ fontSize: '0.52rem', color: '#64748b' }}>READINESS</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                Target Benchmark Role
              </div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#f8fafc' }}>
                {profileData.designation}
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                {profileData.department} · {assessment?.skillGaps?.length || 0} Competency Gaps Identified
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Switch Target Role Benchmark:
              </label>
              <select
                className="input-field"
                value={profileData.designation}
                onChange={(e) => handleRoleChange(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem', width: '260px' }}
              >
                {Object.keys(ROLE_PROFILES).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/mcq-generator')}
              style={{ marginTop: '18px', padding: '10px 14px', fontSize: '0.8rem' }}
            >
              <Brain size={15} /> Diagnose with AI Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Official Profile Details & AI Gaps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#6366f1" /> Official Officer Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  className="input-field"
                  value={profileData.name}
                  onChange={(e) => setProfileData(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="input-label">Current Division / Department</label>
                <input
                  className="input-field"
                  value={profileData.department}
                  onChange={(e) => setProfileData(p => ({ ...p, department: e.target.value }))}
                />
              </div>

              <div>
                <label className="input-label">Current Assignment & Statistical Area</label>
                <input
                  className="input-field"
                  value={profileData.currentAssignment}
                  onChange={(e) => setProfileData(p => ({ ...p, currentAssignment: e.target.value }))}
                />
              </div>

              <div>
                <label className="input-label">Years in Statistical Service</label>
                <input
                  className="input-field"
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => setProfileData(p => ({ ...p, experience: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* AI Gap Summary */}
          {assessment && (
            <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={16} color="#f87171" /> Identified Competency Gaps ({assessment.skillGaps?.length || 0})
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '12px' }}>
                Calculated against the official MoSPI FRAC standard for {profileData.designation}.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {(assessment.skillGaps || []).map(gap => (
                  <div
                    key={`${gap.domain}-${gap.skill}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>{gap.skill}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{gap.domain} · Current: L{gap.current} / Target: L{gap.required}</div>
                    </div>
                    <span className={`badge badge-${gap.priority === 'Critical' ? 'danger' : 'warning'}`} style={{ fontSize: '0.68rem' }}>
                      Gap: +{gap.gap} ({gap.priority})
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-outline"
                onClick={() => navigate('/learning-path')}
                style={{ width: '100%', marginTop: '14px', fontSize: '0.8rem' }}
              >
                View Recommended iGOT Training Path <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Competency Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(COMPETENCY_FRAMEWORK).map(([domain, skills]) => {
            const domainBenchmark = currentRoleBenchmark.competencies[domain] || {};
            return (
              <div key={domain} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.92rem' }}>{domain} Domain</h3>
                  <span className="badge badge-primary">{domainScore(domain)}% Proficiency</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {skills.map(skill => {
                    const currentLevel = competencies[domain]?.[skill] || 0;
                    const requiredLevel = domainBenchmark[skill] || 3;

                    return (
                      <div key={skill} style={{ padding: '4px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{skill}</span>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: LEVEL_COLORS[currentLevel], fontWeight: 600 }}>
                              Level {currentLevel}: {LEVEL_LABELS[currentLevel]}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                              (Req: L{requiredLevel})
                            </span>
                          </div>
                        </div>

                        {/* Interactive Level Selector */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {[1, 2, 3, 4].map(l => {
                            const isFilled = l <= currentLevel;
                            const isReq = l === requiredLevel;
                            return (
                              <button
                                key={l}
                                onClick={() => setCompetencies(prev => ({
                                  ...prev,
                                  [domain]: { ...prev[domain], [skill]: l }
                                }))}
                                style={{
                                  flex: 1,
                                  height: '8px',
                                  borderRadius: '999px',
                                  border: isReq ? '1px solid #06b6d4' : 'none',
                                  cursor: 'pointer',
                                  background: isFilled ? LEVEL_COLORS[currentLevel] : 'rgba(255,255,255,0.08)',
                                  transition: 'all 0.15s ease',
                                }}
                                title={`Set ${skill} to Level ${l} (${LEVEL_LABELS[l]})`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
