import { useAuth } from '../context/AuthContext';
import { useIntelligence } from '../context/IntelligenceContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, BookOpen, Brain, Clock, Target, Award,
  ChevronRight, Flame, AlertCircle, CheckCircle2, ArrowUpRight, Sparkles
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart
} from 'recharts';

const progressData = [
  { week: 'Week 1', score: 45 }, { week: 'Week 2', score: 52 },
  { week: 'Week 3', score: 58 }, { week: 'Week 4', score: 63 },
  { week: 'Week 5', score: 71 }, { week: 'Week 6', score: 68 },
  { week: 'Week 7', score: 76 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { assessment, assessmentLoading } = useIntelligence();
  const navigate = useNavigate();

  // If assessment exists, derive live metrics; else use defaults
  const domainScores = assessment?.domainScores || {
    Statistical: 70,
    Technical: 45,
    'Digital Governance': 60,
    Behavioural: 75,
  };

  const competencyRadarData = Object.entries(domainScores).map(([subject, A]) => ({
    subject: subject.replace(' Governance', ' Gov'),
    A: Number(A) || 0,
    fullMark: 100
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
    { title: 'Python for Statistical Data Processing & Analysis', provider: 'iGOT Karmayogi Bharat', match: 94, domain: 'Technical' },
    { title: 'Advanced Survey Sampling & Estimation Techniques', provider: 'NSSTA TPAC', match: 91, domain: 'Statistical' },
    { title: 'Digital Personal Data Protection (DPDP) Act 2023', provider: 'iGOT Karmayogi Bharat', match: 86, domain: 'Digital Governance' },
  ]).slice(0, 3).map(course => ({
    title: course.title,
    platform: (course.provider || '').includes('iGOT') ? 'iGOT' : 'NSSTA',
    progress: Math.max(20, (course.match || 80) - 20),
    icon: course.domain === 'Technical' ? '📊' : course.domain === 'Statistical' ? '🎯' : '☁️',
  }));

  const overallScore = assessment?.overallScore ?? 62;

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">Good day, {user?.name?.split(' ')[0] || 'Official'} 👋</h1>
            <p className="page-subtitle">
              {user?.designation || 'Statistical Officer'} · {user?.department || 'National Statistical Office'} · {user?.experience || 2} years experience
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              <Flame size={12} /> Active Learner
            </span>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/profile')}>
              <Sparkles size={14} /> Update FRAC Profile
            </button>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: '12px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap'
      }}>
        <AlertCircle size={20} color="#818cf8" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>
            AI Competency Engine: {rawGaps.length > 0 ? `${rawGaps.length} target gaps diagnosed for your role` : 'Assessment initialized from MoSPI FRAC standard'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            {topGaps.slice(0, 3).map(g => g.skill).join(', ')} — {recommendations.length > 0 ? recommendations.length : 10} iGOT courses aligned to bridge these gaps.
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/learning-path')}>
          View iGOT Learning Path <ChevronRight size={14} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Competency Readiness', value: `${overallScore}%`, icon: TrendingUp, color: '#6366f1', sub: 'Target benchmark aligned' },
          { label: 'Assigned Courses', value: `${recommendations.length > 0 ? recommendations.length : 8}`, icon: BookOpen, color: '#06b6d4', sub: 'iGOT Karmayogi' },
          { label: 'Identified Gaps', value: `${rawGaps.length > 0 ? rawGaps.length : 6}`, icon: Brain, color: '#10b981', sub: 'AI Diagnosed' },
          { label: 'Learning Hours', value: '46h', icon: Clock, color: '#f59e0b', sub: 'MoSPI NSSTA Verified' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', background: `${color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <ArrowUpRight size={14} color="#10b981" />
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '6px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Radar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>Competency Radar (FRAC)</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>AI-assessed across 4 MoSPI domains</div>
            </div>
            <span className="badge badge-primary">Live DB</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={competencyRadarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>Learning Trajectory</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Competency index over time</div>
            </div>
            <span className="badge badge-success">+24%</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="scoreGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[30, 90]} />
              <Tooltip contentStyle={{ background: '#16161f', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.8rem' }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGradDash)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Gaps & Courses */}
      <div className="grid-2">
        {/* Skill Gaps */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>Top Competency Gaps</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Prioritized for official upskilling</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/profile')}>
              Edit Profile <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topGaps.map(({ skill, current, required, priority }) => (
              <div key={skill}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.83rem', fontWeight: 500 }}>{skill}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>L{Math.round(current/25)} → L{Math.round(required/25)}</span>
                    <span className={`badge badge-${priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'success'}`}>
                      {priority}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${current}%`, background: current < 30 ? '#ef4444' : current < 60 ? '#f59e0b' : '#10b981' }} />
                  </div>
                  <div style={{ width: `${100 - required}%`, height: '8px', background: 'rgba(99,102,241,0.2)', borderRadius: '999px', flexShrink: 0, maxWidth: '30px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>Recommended iGOT Modules</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>From iGOT Karmayogi Bharat · NSSTA</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')}>
              Browse All <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeCourses.map(({ title, platform, progress, icon }) => (
              <div key={title} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px', background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ fontSize: '1.8rem' }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.83rem', fontWeight: 600, marginBottom: '4px' }}>{title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge badge-${platform === 'iGOT' ? 'primary' : 'info'}`}>{platform}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{progress}% match</span>
                  </div>
                </div>
                <button className="btn btn-ghost btn-xs" onClick={() => navigate('/learning-path')}>
                  Learn <ChevronRight size={12} />
                </button>
              </div>
            ))}
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/mcq-generator')}>
              <Brain size={16} /> Generate Quiz from Training Material
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
