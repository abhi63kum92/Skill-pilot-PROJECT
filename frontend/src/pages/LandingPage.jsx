import { useNavigate } from 'react-router-dom';
import { Zap, Brain, BookOpen, BarChart3, ChevronRight, Star, Users, Award } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Competency Assessment', desc: 'Automated skill-gap analysis using ML and NLP to map your expertise against government competency frameworks.', color: '#6366f1' },
  { icon: BookOpen, title: 'iGOT Karmayogi Integration', desc: 'Seamlessly connected with India\'s official learning platform. Personalized course recommendations from 1000+ courses.', color: '#06b6d4' },
  { icon: Zap, title: 'AI Quiz Generator', desc: 'Upload PDF, PPT, DOCX — AI generates MCQs instantly using Google Gemini LLM. Perfect for self-assessment.', color: '#10b981' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time learning analytics, progress tracking, and predictive insights for individuals and organizations.', color: '#f59e0b' },
];

const stats = [
  { value: '50,000+', label: 'Officials Trained' },
  { value: '1,200+', label: 'iGOT Courses' },
  { value: '95%', label: 'Skill Match Rate' },
  { value: '4 Domains', label: 'Competency Areas' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f1f5f9' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>SkillPilot</div>
            <div style={{ fontSize: '0.6rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.1em' }}>AI LEARNING PLATFORM</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Powered by MoSPI · iGOT Karmayogi</div>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Get Started <ChevronRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '100px 48px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '999px',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          marginBottom: '28px', fontSize: '0.8rem', color: '#818cf8', fontWeight: 600,
        }}>
          🇮🇳 National Statistical Capacity Building Portal · MoSPI & iGOT Karmayogi
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', maxWidth: '900px', margin: '0 auto 24px' }}>
          AI-Powered Skill Intelligence
          <br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            for India's Statistical Workforce
          </span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Identify competency gaps, get personalized learning paths from iGOT Karmayogi, and generate AI-powered quizzes from your learning materials — all in one platform.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            <Zap size={18} /> Start Learning Now
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            View Demo
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
          maxWidth: '700px', margin: '64px auto 0',
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {value}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '12px' }}>
            Everything you need to upskill
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Built specifically for officials in India's Official Statistical System</p>
        </div>
        <div className="grid-2" style={{ maxWidth: '960px', margin: '0 auto', gap: '20px' }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card" style={{ position: 'relative', overflow: 'hidden', padding: '28px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${color}20`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 48px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '24px', padding: '60px 40px', maxWidth: '700px', margin: '0 auto',
        }}>
          <Users size={40} color="#6366f1" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '12px' }}>
            Ready to bridge your skill gap?
          </h2>
          <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.95rem' }}>
            Join thousands of MoSPI officials already building future-ready skills
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            Login with Government ID <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 48px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: '#334155' }}>
          © 2026 SkillPilot · Ministry of Statistics & Programme Implementation (MoSPI)
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['MoSPI', 'iGOT Karmayogi', 'NSSTA', 'TPAC'].map(tag => (
            <span key={tag} className="badge badge-primary">{tag}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
