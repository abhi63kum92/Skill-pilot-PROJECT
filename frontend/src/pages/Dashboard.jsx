import { useAuth } from '../context/AuthContext';
import { useIntelligence } from '../context/IntelligenceContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, BookOpen, Brain, Clock, Target, Award,
  ChevronRight, Flame, AlertCircle, CheckCircle2, ArrowUpRight,
  Sparkles, Download, Zap, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Area, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const progressData = [
  { week: 'W1', score: 45 }, { week: 'W2', score: 52 },
  { week: 'W3', score: 58 }, { week: 'W4', score: 63 },
  { week: 'W5', score: 71 }, { week: 'W6', score: 68 },
  { week: 'W7', score: 76 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { assessment } = useIntelligence();
  const navigate = useNavigate();

  const domainScores = assessment?.domainScores || {
    Statistical: 70, Technical: 45,
    'Digital Governance': 60, Behavioural: 75,
  };

  const competencyRadarData = Object.entries(domainScores).map(([subject, A]) => ({
    subject: subject.replace(' Governance', ' Gov'),
    A: Number(A) || 0, fullMark: 100
  }));

  const rawGaps = assessment?.skillGaps || [];
  const topGaps = (rawGaps.length > 0 ? rawGaps : [
    { skill: 'Python', current: 1, required: 3, priority: 'Critical' },
    { skill: 'Sampling Methods', current: 2, required: 4, priority: 'Critical' },
    { skill: 'AI/ML Basics', current: 1, required: 2, priority: 'High' },
    { skill: 'Data Privacy', current: 2, required: 3, priority: 'High' },
  ]).slice(0, 5).map(gap => ({
    skill: gap.skill,
    current: Math.round((gap.current / 4) * 100),
    required: Math.round((gap.required / 4) * 100),
    priority: gap.priority === 'Critical' ? 'High' : 'Medium',
  }));

  const recommendations = assessment?.recommendations || [];
  const activeCourses = (recommendations.length > 0 ? recommendations : [
    { title: 'Python for Statistical Data Processing & Analysis', provider: 'iGOT Karmayogi Bharat', match: 94, domain: 'Technical', image: '/courses/course_python.jpg' },
    { title: 'Advanced Survey Sampling & Estimation Techniques', provider: 'NSSTA TPAC', match: 91, domain: 'Statistical', image: '/courses/course_sampling.jpg' },
    { title: 'Digital Personal Data Protection (DPDP) Act 2023', provider: 'iGOT Karmayogi Bharat', match: 86, domain: 'Digital Governance', image: '/courses/course_dpdp.jpg' },
  ]).slice(0, 3).map(course => ({
    title: course.title,
    platform: (course.provider || '').includes('iGOT') ? 'iGOT' : 'NSSTA',
    progress: Math.max(20, (course.match || 80) - 20),
    image: course.image || (course.domain === 'Technical' ? '/courses/course_python.jpg' : course.domain === 'Statistical' ? '/courses/course_sampling.jpg' : '/courses/course_dpdp.jpg'),
    icon: course.domain === 'Technical' ? '📊' : course.domain === 'Statistical' ? '🎯' : '☁️',
    domain: course.domain,
  }));

  const overallScore = assessment?.overallScore ?? 62;

  const handleDownloadReport = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;
    try {
      toast.loading('Generating PDF...', { id: 'dash-gen' });
      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, backgroundColor: '#f8faff' });
      const link = document.createElement('a');
      link.download = 'MoSPI-Report-' + (user?.name?.replace(/\s+/g, '_') || 'Official') + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Report downloaded!', { id: 'dash-gen' });
    } catch {
      toast.error('Failed to generate report', { id: 'dash-gen' });
    }
  };

  const statCards = [
    {
      label: 'Competency Readiness', value: `${overallScore}%`,
      icon: TrendingUp, color: '#7c3aed', bg: 'linear-gradient(135deg, #7c3aed, #6366f1)',
      lightBg: 'linear-gradient(135deg, #f3f0ff, #ede9fe)',
      sub: 'Target benchmark aligned', subColor: '#7c3aed',
    },
    {
      label: 'Assigned Courses', value: `${recommendations.length > 0 ? recommendations.length : 8}`,
      icon: BookOpen, color: '#0891b2', bg: 'linear-gradient(135deg, #0891b2, #06b6d4)',
      lightBg: 'linear-gradient(135deg, #e0f7fa, #cffafe)',
      sub: 'iGOT Karmayogi', subColor: '#0891b2',
    },
    {
      label: 'Identified Gaps', value: `${rawGaps.length > 0 ? rawGaps.length : 6}`,
      icon: Brain, color: '#059669', bg: 'linear-gradient(135deg, #059669, #10b981)',
      lightBg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
      sub: 'AI Diagnosed', subColor: '#059669',
    },
    {
      label: 'Learning Hours', value: '46h',
      icon: Clock, color: '#d97706', bg: 'linear-gradient(135deg, #d97706, #f59e0b)',
      lightBg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
      sub: 'MoSPI NSSTA Verified', subColor: '#d97706',
    },
  ];

  return (
    <div id="dashboard-content" style={{ paddingBottom: '24px' }}>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .dash-stat-card {
          border-radius: 20px;
          padding: 22px 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          animation: fadeInUp 0.5s ease forwards;
          cursor: default;
        }
        .dash-stat-card:hover {
          transform: translateY(-5px);
        }
        .dash-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s ease;
        }
        .dash-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.09);
        }
        .dash-course-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1.5px solid #f1f5f9;
          background: #fafbff;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .dash-course-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          border-color: #e0e7ff;
        }
        .dash-gap-bar-bg {
          height: 8px;
          background: #f1f5f9;
          border-radius: 999px;
          overflow: hidden;
          flex: 1;
        }
        .dash-gap-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s ease;
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #f0e7ff 0%, #e0f2fe 60%, #fef3c7 100%)',
        borderRadius: '20px', padding: '24px 28px',
        marginBottom: '22px',
        border: '1.5px solid rgba(124,58,237,0.12)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px',
      }}>
        <div>
          <h1 style={{
            fontSize: '1.65rem', fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800, color: '#0f172a', marginBottom: '6px',
          }}>
            Good day, {user?.name?.split(' ')[0] || 'Official'} 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
            {user?.designation || 'Statistical Officer'} · {user?.department || 'National Statistical Office'} · {user?.experience || 2} years experience
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '6px 14px', borderRadius: '999px',
            background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
            color: '#15803d', fontSize: '0.75rem', fontWeight: 700,
            border: '1px solid #86efac',
          }}>
            <Flame size={12} /> Active Learner
          </span>
          <button onClick={handleDownloadReport} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '10px',
            background: 'white', color: '#475569',
            border: '1.5px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.color = '#7c3aed'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
          >
            <Download size={14} /> Download PDF
          </button>
          <button onClick={() => navigate('/profile')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: 'white', border: 'none', fontSize: '0.8rem', fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            <Sparkles size={14} /> Update FRAC Profile
          </button>
        </div>
      </div>

      {/* ── Alert Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed, #2563eb, #0891b2)',
        borderRadius: '16px', padding: '16px 22px',
        display: 'flex', alignItems: 'center', gap: '16px',
        marginBottom: '22px', flexWrap: 'wrap',
        boxShadow: '0 6px 24px rgba(124,58,237,0.25)',
      }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.18)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={18} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white', marginBottom: '3px' }}>
            AI Competency Engine: {rawGaps.length > 0 ? `${rawGaps.length} target gaps diagnosed for your role` : 'Assessment initialized from MoSPI FRAC standard'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>
            {topGaps.slice(0, 3).map(g => g.skill).join(', ')} — {recommendations.length > 0 ? recommendations.length : 10} iGOT courses aligned to bridge these gaps.
          </div>
        </div>
        <button onClick={() => navigate('/learning-path')} style={{
          padding: '9px 20px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(10px)',
          color: 'white', border: '1.5px solid rgba(255,255,255,0.4)',
          fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.32)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        >
          View iGOT Learning Path <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '22px',
      }}>
        {statCards.map(({ label, value, icon: Icon, color, bg, lightBg, sub, subColor }, i) => (
          <div key={label} className="dash-stat-card" style={{
            background: lightBg,
            border: `1.5px solid ${color}22`,
            boxShadow: `0 4px 20px ${color}18`,
            animationDelay: `${i * 0.08}s`,
          }}>
            {/* Decorative circle */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: `${color}14`, pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px ${color}40`,
              }}>
                <Icon size={20} color="white" />
              </div>
              <ArrowUpRight size={15} color={color} style={{ opacity: 0.7 }} />
            </div>
            <div style={{
              fontSize: '2rem', fontWeight: 900,
              fontFamily: 'Space Grotesk, sans-serif', color: color,
              lineHeight: 1,
            }}>{value}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', margin: '6px 0 4px' }}>{label}</div>
            <div style={{ fontSize: '0.7rem', color: subColor, fontWeight: 600 }}>↑ {sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px', marginBottom: '22px',
      }}>
        {/* Radar */}
        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}>
                Competency Radar (FRAC)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>AI-assessed across 4 MoSPI domains</div>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: '999px',
              background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
              color: '#7c3aed', fontSize: '0.72rem', fontWeight: 700,
              border: '1px solid #c4b5fd',
            }}>Live DB</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={competencyRadarData}>
              <PolarGrid stroke="rgba(124,58,237,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
              <Radar name="Score" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.18} strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 3 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}>
                Learning Trajectory
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Competency index over time</div>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: '999px',
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              color: '#15803d', fontSize: '0.72rem', fontWeight: 700,
              border: '1px solid #86efac',
            }}>+24%</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="scoreGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[30, 90]} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'white', border: '1.5px solid #e0e7ff',
                  borderRadius: '12px', color: '#0f172a', fontSize: '0.8rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} fill="url(#scoreGradDash)" dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#7c3aed' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Skill Gaps & Courses ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px',
      }}>
        {/* Skill Gaps */}
        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}>
                Top Competency Gaps
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Prioritized for official upskilling</div>
            </div>
            <button onClick={() => navigate('/profile')} style={{
              padding: '6px 14px', borderRadius: '8px',
              background: '#f8faff', color: '#7c3aed',
              border: '1.5px solid #e0e7ff',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ede9fe'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; }}
            >
              Edit Profile <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topGaps.map(({ skill, current, required, priority }) => {
              const barColor = current < 30 ? '#ef4444' : current < 60 ? '#f59e0b' : '#10b981';
              const badgeBg = priority === 'High' ? '#fee2e2' : '#fef3c7';
              const badgeColor = priority === 'High' ? '#dc2626' : '#d97706';
              return (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>{skill}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                        L{Math.round(current / 25)} → L{Math.round(required / 25)}
                      </span>
                      <span style={{
                        padding: '2px 10px', borderRadius: '999px',
                        background: badgeBg, color: badgeColor,
                        fontSize: '0.68rem', fontWeight: 700,
                      }}>{priority}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="dash-gap-bar-bg">
                      <div className="dash-gap-bar-fill" style={{ width: `${current}%`, background: `linear-gradient(90deg, ${barColor}aa, ${barColor})` }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, width: '32px', textAlign: 'right' }}>{current}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}>
                Recommended iGOT Modules
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>From iGOT Karmayogi Bharat · NSSTA</div>
            </div>
            <button onClick={() => navigate('/courses')} style={{
              padding: '6px 14px', borderRadius: '8px',
              background: '#f8faff', color: '#0891b2',
              border: '1.5px solid #cffafe',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e0f7fa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; }}
            >
              Browse All <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeCourses.map(({ title, platform, progress, image, icon }, i) => {
              const platColor = platform === 'iGOT' ? '#0891b2' : '#7c3aed';
              const platBg = platform === 'iGOT' ? '#e0f7fa' : '#ede9fe';
              return (
                <div key={i} className="dash-course-item">
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '10px', flexShrink: 0,
                    overflow: 'hidden', border: '1.5px solid #e0e7ff', position: 'relative'
                  }}>
                    <img
                      src={image || '/courses/course_python.jpg'}
                      alt={title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/banners/banner1.jpg'; }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: '#1e293b', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: '999px',
                        background: platBg, color: platColor,
                        fontSize: '0.68rem', fontWeight: 700,
                        border: `1px solid ${platColor}30`,
                      }}>{platform}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>{progress}% match</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/learning-path')} style={{
                    padding: '7px 12px', borderRadius: '9px',
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    color: 'white', border: 'none', fontSize: '0.72rem',
                    fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    boxShadow: '0 3px 10px rgba(124,58,237,0.3)',
                    flexShrink: 0,
                  }}>
                    Go <ChevronRight size={11} />
                  </button>
                </div>
              );
            })}

            {/* Quiz CTA */}
            <button onClick={() => navigate('/mcq-generator')} style={{
              width: '100%', marginTop: '4px',
              padding: '13px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 60%, #0891b2 100%)',
              color: 'white', border: 'none',
              fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 6px 20px rgba(124,58,237,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.3)'; }}
            >
              <Brain size={16} /> Generate Quiz from Training Material
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
