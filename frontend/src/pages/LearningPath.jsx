import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, ChevronRight, Clock, Zap, ArrowRight, Lock,
  ExternalLink, Brain, Sparkles, BookOpen, ShieldCheck, Target, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useIntelligence } from '../context/IntelligenceContext';
import { useAuth } from '../context/AuthContext';

const priorityColor = { Critical: '#ef4444', High: '#f59e0b', Medium: '#06b6d4', Urgent: '#ef4444', Recommended: '#06b6d4' };

export default function LearningPath() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assessment } = useIntelligence();
  const [expandedPath, setExpandedPath] = useState(1);
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  // Recommendations dynamically mapped from AI Assessment
  const recommendations = assessment?.recommendations || [];
  const skillGaps = assessment?.skillGaps || [];

  // Group recommendations into 3 thematic pathways
  const pathways = recommendations.length > 0 ? [
    {
      id: 1,
      title: 'Statistical Methodology & Survey Operations',
      domain: 'Statistical',
      priority: skillGaps.some(g => g.domain === 'Statistical' && g.priority === 'Critical') ? 'Critical' : 'High',
      description: 'Role-benchmarked trajectory aligned with NSSTA Training Plan & National Indicator Framework.',
      courses: recommendations.filter(r => r.domain === 'Statistical'),
      addressedGaps: skillGaps.filter(g => g.domain === 'Statistical').map(g => g.skill),
    },
    {
      id: 2,
      title: 'Digital Technology, Python & AI/ML Systems',
      domain: 'Technical',
      priority: skillGaps.some(g => g.domain === 'Technical' && g.priority === 'Critical') ? 'Critical' : 'High',
      description: 'Modern data stack upskilling: automated ETL pipelines, large-scale survey processing, GIS.',
      courses: recommendations.filter(r => r.domain === 'Technical'),
      addressedGaps: skillGaps.filter(g => g.domain === 'Technical').map(g => g.skill),
    },
    {
      id: 3,
      title: 'Digital Public Infrastructure & Data Privacy Governance',
      domain: 'Digital Governance',
      priority: skillGaps.some(g => g.domain === 'Digital Governance' && g.priority === 'Critical') ? 'High' : 'Medium',
      description: 'Statutory compliance under DPDP Act 2023, cyber resilience, and open government data APIs.',
      courses: recommendations.filter(r => r.domain === 'Digital Governance' || r.domain === 'Behavioural'),
      addressedGaps: skillGaps.filter(g => g.domain === 'Digital Governance' || g.domain === 'Behavioural').map(g => g.skill),
    }
  ].filter(p => p.courses.length > 0) : [
    {
      id: 1,
      title: 'Statistical Methodology & Survey Operations',
      domain: 'Statistical',
      priority: 'Critical',
      description: 'Core official statistics capacity building from NSSTA & MoSPI SDRD Division.',
      courses: [
        { id: 'c1', title: 'Advanced Survey Sampling & Estimation Techniques', provider: 'NSSTA TPAC', duration: '25 Hours', match: 96, skills: ['Sampling Methods', 'Survey Design'] },
        { id: 'c2', title: 'National Indicator Framework for SDGs', provider: 'NSSTA TPAC', duration: '15 Hours', match: 91, skills: ['SDG Indicators', 'Data Quality'] },
      ],
      addressedGaps: ['Sampling Methods', 'Survey Design', 'SDG Indicators'],
    },
    {
      id: 2,
      title: 'Python, SQL & Spatial Data Analytics',
      domain: 'Technical',
      priority: 'Critical',
      description: 'Microdata computing and big-data processing pipelines for official surveys.',
      courses: [
        { id: 'c3', title: 'Python for Statistical Data Processing & Analysis', provider: 'iGOT Karmayogi Bharat', duration: '30 Hours', match: 98, skills: ['Python', 'SQL'] },
        { id: 'c4', title: 'GIS Mapping & Spatial Analysis for Census and Surveys', provider: 'NSSTA / ISRO-NRSC', duration: '20 Hours', match: 88, skills: ['GIS'] },
      ],
      addressedGaps: ['Python', 'SQL', 'GIS'],
    }
  ];

  const handleLaunchIgot = (course) => {
    toast.success(`🚀 Redirecting to iGOT Karmayogi Module: "${course.title}"`);
    window.open(course.url || 'https://igotkarmayogi.gov.in/', '_blank');
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">
                <ShieldCheck size={12} /> iGOT Karmayogi Ecosystem Integration
              </span>
              <span className="badge badge-success">
                {user?.designation || 'Statistical Officer'}
              </span>
            </div>
            <h1 className="page-title">Personalized Capacity Building Trajectories</h1>
            <p className="page-subtitle">
              Dynamic learning pathways auto-generated from your MoSPI FRAC competency gap analysis
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/profile')}>
              <Target size={15} /> Recalibrate Gaps
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/mcq-generator')}>
              <Brain size={15} /> AI Diagnostic Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Integration Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))',
        border: '1px solid rgba(99,102,241,0.25)', borderRadius: '14px',
        padding: '20px 24px', marginBottom: '28px',
        display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap'
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: '3px', fontSize: '0.96rem' }}>
            AI-to-iGOT Karmayogi Dynamic Integration Engine
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Identified <strong style={{ color: '#818cf8' }}>{skillGaps.length} competency gaps</strong> against your benchmark role. The sequence below directly orchestrates accredited courses from <strong style={{ color: '#22d3ee' }}>iGOT Karmayogi Bharat</strong> and <strong style={{ color: '#fbbf24' }}>NSSTA TPAC</strong> to eliminate gaps and earn verified certifications.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => window.open('https://igotkarmayogi.gov.in/', '_blank')}>
            <ExternalLink size={13} /> Open iGOT Portal
          </button>
        </div>
      </div>

      {/* Pathways List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {pathways.map((path) => {
          const isExpanded = expandedPath === path.id;
          const totalHours = path.courses.reduce((acc, c) => acc + parseInt(c.duration || '20', 10), 0);

          return (
            <div key={path.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
              {/* Path Header */}
              <div
                style={{
                  padding: '22px 26px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(99,102,241,0.06)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'all 0.2s',
                }}
                onClick={() => setExpandedPath(isExpanded ? null : path.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{path.title}</h3>
                    <span className="badge" style={{ background: `${priorityColor[path.priority]}20`, color: priorityColor[path.priority], border: `1px solid ${priorityColor[path.priority]}40` }}>
                      {path.priority} Priority
                    </span>
                    <span className="badge badge-primary">
                      {path.domain} Domain
                    </span>
                  </div>

                  <p style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '12px' }}>
                    {path.description}
                  </p>

                  <div style={{ display: 'flex', gap: '18px', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span><Clock size={13} style={{ verticalAlign: 'middle' }} /> {totalHours} Hours</span>
                    <span>📚 {path.courses.length} Accredited iGOT Modules</span>
                    <span style={{ color: '#818cf8' }}>🎯 Bridges: {path.addressedGaps.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  color="#64748b"
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                    transition: 'transform 0.25s',
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Expanded Steps */}
              {isExpanded && (
                <div style={{ padding: '24px 26px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
                    Step-by-Step iGOT Capacity Roadmap
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {path.courses.map((course, idx) => (
                      <div
                        key={course.id || idx}
                        className="card-interactive"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '14px 18px',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(99,102,241,0.02) 100%)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '14px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {/* Step Number Badge */}
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.2))',
                          border: '1px solid rgba(99,102,241,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.85rem', color: '#c7d2fe', flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>

                        {/* Mini Course Thumbnail */}
                        <div style={{
                          width: '64px', height: '54px', borderRadius: '10px',
                          overflow: 'hidden', flexShrink: 0, position: 'relative',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          <img
                            src={course.image || (idx % 2 === 0 ? '/courses/course_python.jpg' : '/courses/course_sampling.jpg')}
                            alt={course.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/banners/banner1.jpg'; }}
                          />
                        </div>

                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc' }}>
                              {course.title}
                            </div>
                            <span className={`badge badge-${course.provider.includes('iGOT') ? 'primary' : 'info'}`} style={{ fontSize: '0.65rem' }}>
                              {course.provider}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                              🎯 {course.match || 92}% Match
                            </span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                            {course.description || `Comprehensive capacity building module covering ${course.skills?.join(', ') || 'core concepts'}.`}
                          </div>

                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {(course.skills || course.addressedSkills || []).map(sk => (
                              <span key={sk} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: '0.68rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} color="#818cf8" /> {course.duration}
                          </span>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleLaunchIgot(course)}
                            style={{ whiteSpace: 'nowrap', borderRadius: '8px' }}
                          >
                            <ExternalLink size={13} /> Launch on iGOT
                          </button>

                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate('/mcq-generator')}
                            title="Generate practice quiz for this course"
                            style={{ borderRadius: '8px' }}
                          >
                            <Brain size={13} /> Quiz
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
