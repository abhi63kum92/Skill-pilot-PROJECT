import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Brain, BookOpen, BarChart3, ChevronRight,
  Users, Landmark, Compass, Sparkles, ArrowRight,
  Shield, Globe, Award, TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Competency Assessment',
    desc: 'Automated skill-gap analysis using ML and NLP to map your expertise against government FRAC frameworks.',
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    emoji: '🧠',
  },
  {
    icon: BookOpen,
    title: 'iGOT Karmayogi Integration',
    desc: "Seamlessly connected with India's official learning platform. Personalized recommendations from 1200+ courses.",
    color: '#06b6d4',
    bg: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    emoji: '📚',
  },
  {
    icon: Zap,
    title: 'AI Quiz Generator',
    desc: 'Upload PDF, PPT, DOCX — AI generates MCQs instantly using Groq LLM. Perfect for self-assessment.',
    color: '#10b981',
    bg: 'linear-gradient(135deg, #10b981, #34d399)',
    emoji: '⚡',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Real-time learning analytics, progress tracking, and predictive insights for individuals and orgs.',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    emoji: '📊',
  },
];

const stats = [
  { value: '50,000+', label: 'Officials Trained', icon: Users, color: '#8b5cf6' },
  { value: '1,200+', label: 'iGOT Courses', icon: BookOpen, color: '#06b6d4' },
  { value: '95%', label: 'Skill Match Rate', icon: TrendingUp, color: '#10b981' },
  { value: '4 Domains', label: 'Competency Areas', icon: Award, color: '#f59e0b' },
];

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Register with your official government email and designation.', color: '#8b5cf6' },
  { num: '02', title: 'AI Competency Scan', desc: 'Our AI maps your skills against FRAC competency benchmarks.', color: '#06b6d4' },
  { num: '03', title: 'Get Learning Path', desc: 'Receive curated iGOT Karmayogi courses tailored to your gaps.', color: '#10b981' },
  { num: '04', title: 'Track & Certify', desc: 'Complete quizzes, earn certificates, and track your growth.', color: '#f59e0b' },
];

const DEMO_ROLES = [
  {
    role: 'Junior Statistical Officer (JSO)',
    dept: 'Field Operations Division (FOD)',
    score: 68,
    gaps: ['Sampling Methods', 'Python Microdata', 'DPDP Act 2023'],
    topCourse: 'Python for Statistical Data Processing & Analysis',
    courseImg: '/courses/course_python.jpg',
    provider: 'iGOT Karmayogi Bharat',
    hours: '30 Hours',
    match: '98%'
  },
  {
    role: 'Statistical Officer (SSO)',
    dept: 'Survey Design & Research Division (SDRD)',
    score: 79,
    gaps: ['Advanced Sampling (PLFS/ASI)', 'Supply-Use Tables', 'GIS Spatial Mapping'],
    topCourse: 'Advanced Survey Sampling & Estimation Techniques',
    courseImg: '/courses/course_sampling.jpg',
    provider: 'NSSTA TPAC',
    hours: '25 Hours',
    match: '96%'
  },
  {
    role: 'Indian Statistical Service (ISS)',
    dept: 'National Accounts Division (NAD)',
    score: 86,
    gaps: ['System of National Accounts (SNA 2008)', 'Macroeconomic GDP Deflators'],
    topCourse: 'System of National Accounts (SNA 2008) & GDP Compilation',
    courseImg: '/courses/course_accounts.jpg',
    provider: 'MoSPI NAD / NSSTA',
    hours: '35 Hours',
    match: '99%'
  },
  {
    role: 'Data Scientist / Director',
    dept: 'Data Informatics & Innovation Division (DIID)',
    score: 92,
    gaps: ['Satellite AI Imagery', 'Citizen Data Governance & Privacy'],
    topCourse: 'Digital Personal Data Protection (DPDP) Act 2023 & Cybersecurity',
    courseImg: '/courses/course_dpdp.jpg',
    provider: 'Karmayogi Bharat',
    hours: '12 Hours',
    match: '95%'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);

  const currentDemoRole = DEMO_ROLES[selectedRoleIdx];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % features.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', color: '#1e293b', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(124,58,237,0.3); }
          50% { box-shadow: 0 0 35px rgba(124,58,237,0.6), 0 0 20px rgba(6,182,212,0.4); }
        }

        .hero-heading { animation: fadeInUp 0.7s ease forwards; }
        .hero-sub { animation: fadeInUp 0.7s 0.15s ease forwards; opacity: 0; }
        .hero-btns { animation: fadeInUp 0.7s 0.28s ease forwards; opacity: 0; }
        .hero-badge { animation: fadeInUp 0.7s 0.05s ease forwards; opacity: 0; }

        .feature-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 64px rgba(0,0,0,0.1) !important;
        }

        .stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }

        .step-card {
          transition: transform 0.2s ease;
        }
        .step-card:hover { transform: translateY(-4px); }

        .cta-btn-primary {
          padding: 15px 32px;
          background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
          background-size: 200% 200%;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 28px rgba(124,58,237,0.38);
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.01em;
        }
        .cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(124,58,237,0.48);
        }

        .cta-btn-outline {
          padding: 15px 28px;
          background: white;
          color: #7c3aed;
          border: 2px solid #7c3aed;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          transition: all 0.2s ease;
          font-family: 'Space Grotesk', sans-serif;
          box-shadow: 0 4px 12px rgba(124,58,237,0.12);
        }
        .cta-btn-outline:hover {
          background: #7c3aed;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.3);
        }

        .nav-btn {
          padding: 9px 22px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 14px rgba(124,58,237,0.35);
          font-family: 'Space Grotesk', sans-serif;
        }
        .nav-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(124,58,237,0.45); }

        .role-pill-btn {
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1.5px solid transparent;
        }

        .simulator-box {
          animation: pulseGlow 4s infinite ease-in-out;
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 32px',
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.1)' : '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
          }}>
            <Landmark size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1e293b', lineHeight: 1.2 }}>SkillPilot</div>
            <div style={{ fontSize: '0.55rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.1em' }}>AI LEARNING PLATFORM</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="landing-desktop-only">
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Powered by MoSPI · DIID · iGOT Karmayogi</div>
          <button className="nav-btn" onClick={() => navigate('/login')}>
            Get Started <ChevronRight size={15} />
          </button>
        </div>

        <button className="nav-btn landing-mobile-only" onClick={() => navigate('/login')} style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
          Login
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        background: 'linear-gradient(135deg, #f0e7ff 0%, #e0f2fe 40%, #fef3c7 70%, #f0fdf4 100%)',
        padding: 'clamp(50px, 8vw, 85px) clamp(20px, 5vw, 60px) clamp(50px, 7vw, 80px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative ambient glowing orbs */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div className="hero-badge" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '7px 18px', borderRadius: '999px',
          background: 'rgba(124,58,237,0.1)', border: '1.5px solid rgba(124,58,237,0.25)',
          marginBottom: '24px', fontSize: '0.8rem',
          color: '#7c3aed', fontWeight: 700,
        }}>
          <span style={{ fontSize: '1rem' }}>🇮🇳</span>
          National Statistical Capacity Building Portal · MoSPI (DIID) & iGOT Karmayogi
        </div>

        {/* Heading */}
        <h1 className="hero-heading" style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 900, lineHeight: 1.1,
          marginBottom: '20px',
          maxWidth: '880px', margin: '0 auto 20px',
          color: '#0f172a',
          letterSpacing: '-0.02em',
        }}>
          AI-Powered Skill Intelligence
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 40%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%', animation: 'gradientMove 4s ease infinite',
          }}>
            for India's Statistical Workforce
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-sub" style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.12rem)',
          color: '#475569', maxWidth: '620px',
          margin: '0 auto 32px', lineHeight: 1.7, padding: '0 12px',
          fontWeight: 500,
        }}>
          Automated competency gap analysis, personalized iGOT Karmayogi pathways,
          and instant AI quiz generation — built for MoSPI & Mission Karmayogi.
        </p>

        {/* CTAs */}
        <div className="hero-btns" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 16px', marginBottom: '40px' }}>
          <button className="cta-btn-primary" onClick={() => navigate('/register')}>
            <Compass size={18} /> Start Free Assessment
          </button>
          <button className="cta-btn-outline" onClick={() => navigate('/login')}>
            <Users size={17} /> Official Demo Login
          </button>
        </div>

        {/* ── LIVE INTERACTIVE AI SIMULATOR WIDGET ── */}
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'left' }}>
          <div className="simulator-box" style={{
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1.5px solid rgba(124,58,237,0.35)',
            padding: '24px 28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            color: 'white',
          }}>
            {/* Widget Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#10b981', boxShadow: '0 0 10px #10b981'
                }} />
                <span style={{ fontSize: '0.86rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                  Live MoSPI FRAC AI Simulator
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', fontWeight: 600 }}>
                  Interactive Preview
                </span>
              </div>

              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Click a role below to simulate AI gap scan ➔
              </div>
            </div>

            {/* Interactive Role Switcher Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '18px' }}>
              {DEMO_ROLES.map((r, idx) => {
                const isSelected = selectedRoleIdx === idx;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRoleIdx(idx)}
                    className="role-pill-btn"
                    style={{
                      background: isSelected ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(255,255,255,0.06)',
                      color: isSelected ? 'white' : '#94a3b8',
                      borderColor: isSelected ? 'transparent' : 'rgba(255,255,255,0.1)',
                      boxShadow: isSelected ? '0 4px 16px rgba(124,58,237,0.45)' : 'none',
                    }}
                  >
                    {idx === 0 ? '🎯 ' : idx === 1 ? '📊 ' : idx === 2 ? '🏛️ ' : '💻 '}
                    {r.role.split('(')[0].trim()}
                  </button>
                );
              })}
            </div>

            {/* Simulated AI Output Panel */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px', background: 'rgba(255,255,255,0.03)',
              borderRadius: '18px', padding: '20px', border: '1px solid rgba(255,255,255,0.07)'
            }}>
              {/* Left Column: Diagnostics */}
              <div>
                <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Target Benchmark & Readiness
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', marginBottom: '2px' }}>
                  {currentDemoRole.role}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
                  {currentDemoRole.dept}
                </div>

                {/* Score Bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>FRAC Role Readiness:</span>
                    <strong style={{ color: currentDemoRole.score >= 80 ? '#34d399' : '#fbbf24' }}>{currentDemoRole.score}%</strong>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${currentDemoRole.score}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                      borderRadius: '999px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>

                {/* Diagnosed Gaps */}
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
                    Diagnosed Priority Gaps:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {currentDemoRole.gaps.map(g => (
                      <span key={g} style={{
                        padding: '3px 9px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                        background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)'
                      }}>
                        ⚠️ {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Matched iGOT Course Preview with 3D Thumbnail */}
              <div style={{
                background: 'rgba(0,0,0,0.35)', borderRadius: '14px',
                padding: '14px', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    🚀 Recommended iGOT Trajectory
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800 }}>
                    🎯 {currentDemoRole.match} AI Match
                  </span>
                </div>

                {/* Course Mini Card with Image */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    width: '74px', height: '60px', borderRadius: '10px',
                    overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.12)'
                  }}>
                    <img
                      src={currentDemoRole.courseImg}
                      alt={currentDemoRole.topCourse}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/banners/banner1.jpg'; }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3, marginBottom: '3px' }}>
                      {currentDemoRole.topCourse}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {currentDemoRole.provider} · {currentDemoRole.hours}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  style={{
                    marginTop: 'auto', width: '100%', padding: '10px',
                    borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    color: 'white', border: 'none', fontWeight: 700, fontSize: '0.78rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    boxShadow: '0 4px 12px rgba(124,58,237,0.4)'
                  }}
                >
                  <Sparkles size={13} /> Unlock Full AI Learning Path <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating feature pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '10px',
          justifyContent: 'center', marginTop: '36px',
        }}>
          {['🧠 AI Competency Mapping', '📚 1200+ iGOT Courses', '⚡ MCQ Generator', '📊 Real-time Analytics', '🎓 Digital Badges'].map((pill, i) => (
            <div key={i} style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#334155',
              border: '1.5px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.07)',
              animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}>
              {pill}
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{
        background: 'white',
        padding: 'clamp(32px, 5vw, 52px) clamp(20px, 5vw, 60px)',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px', maxWidth: '900px', margin: '0 auto',
        }}>
          {stats.map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="stat-card" style={{
              textAlign: 'center', padding: '28px 20px',
              background: `linear-gradient(135deg, ${color}10, ${color}05)`,
              border: `1.5px solid ${color}25`,
              borderRadius: '20px',
              boxShadow: `0 4px 20px ${color}15`,
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${color}18`, margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900,
                fontFamily: 'Space Grotesk, sans-serif', color: color,
              }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{
        padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'linear-gradient(180deg, #fafbff 0%, #f0f4ff 100%)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '999px',
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700, marginBottom: '14px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <Sparkles size={13} /> Platform Features
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            marginBottom: '12px', color: '#0f172a',
          }}>
            Everything you need to upskill
          </h2>
          <p style={{ color: '#64748b', fontSize: 'clamp(0.88rem, 2vw, 1rem)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Built specifically for officials in India's Official Statistical System
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '20px', maxWidth: '1000px', margin: '0 auto',
        }}>
          {features.map(({ icon: Icon, title, desc, color, bg, emoji }, i) => (
            <div key={title} className="feature-card" style={{
              padding: '32px 28px',
              background: 'white',
              borderRadius: '22px',
              border: `1.5px solid ${color}20`,
              boxShadow: `0 8px 32px ${color}12`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Top gradient bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: bg,
                borderRadius: '22px 22px 0 0',
              }} />
              {/* Background emoji */}
              <div style={{
                position: 'absolute', bottom: '-10px', right: '12px',
                fontSize: '5rem', opacity: 0.06, pointerEvents: 'none', userSelect: 'none',
              }}>{emoji}</div>

              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: bg, marginBottom: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 18px ${color}35`,
              }}>
                <Icon size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '10px', color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.75 }}>{desc}</p>

              <div style={{
                marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '0.8rem', fontWeight: 700, color: color, cursor: 'default',
              }}>
                Learn more <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{
        padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 60px)',
        background: 'white',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '999px',
            background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)',
            fontSize: '0.75rem', color: '#0891b2', fontWeight: 700, marginBottom: '14px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <Globe size={13} /> How It Works
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            color: '#0f172a', marginBottom: '12px',
          }}>
            Start in 4 simple steps
          </h2>
          <p style={{ color: '#64748b', fontSize: 'clamp(0.88rem, 2vw, 1rem)', lineHeight: 1.7 }}>
            From signup to personalized learning — takes less than 5 minutes
          </p>
        </div>

        <div className="steps-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px', maxWidth: '960px', margin: '0 auto',
          position: 'relative',
        }}>
          {steps.map(({ num, title, desc, color }, i) => (
            <div key={num} className="step-card" style={{
              padding: '28px 22px',
              background: `linear-gradient(160deg, ${color}08, ${color}03)`,
              border: `1.5px solid ${color}25`,
              borderRadius: '20px',
              textAlign: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900,
                fontSize: '1.1rem', color: 'white',
                boxShadow: `0 6px 20px ${color}40`,
              }}>{num}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        padding: 'clamp(48px, 8vw, 88px) clamp(20px, 5vw, 60px)',
        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 40%, #0891b2 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 6s ease infinite',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>🎯</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900,
            marginBottom: '16px', color: 'white',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
          }}>
            Ready to bridge your skill gap?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '36px', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', lineHeight: 1.7 }}>
            Join thousands of MoSPI & DIID officials already building future-ready skills with AI-powered personalized learning.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '14px 32px',
              background: 'white',
              color: '#7c3aed',
              border: 'none', borderRadius: '14px',
              fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)'; }}
            >
              <Shield size={17} /> Login with Government ID <ChevronRight size={17} />
            </button>
            <button onClick={() => navigate('/register')} style={{
              padding: '14px 28px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(10px)',
              borderRadius: '14px',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: 'Space Grotesk, sans-serif',
              transition: 'background 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = ''; }}
            >
              <Users size={17} /> Create Free Profile
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: 'clamp(20px, 4vw, 32px) clamp(20px, 5vw, 60px)',
        background: '#0f172a',
        display: 'flex', flexWrap: 'wrap', gap: '14px',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Landmark size={14} color="white" />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#475569' }}>
            © 2026 SkillPilot · Ministry of Statistics & Programme Implementation (MoSPI) - DIID
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { tag: 'MoSPI', color: '#7c3aed' },
            { tag: 'DIID', color: '#2563eb' },
            { tag: 'iGOT', color: '#06b6d4' },
            { tag: 'NSSTA', color: '#10b981' },
            { tag: 'TPAC', color: '#f59e0b' },
          ].map(({ tag, color }) => (
            <span key={tag} style={{
              padding: '4px 12px', borderRadius: '100px',
              background: `${color}18`, color: color,
              fontSize: '0.7rem', fontWeight: 700,
              border: `1px solid ${color}30`,
            }}>{tag}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
