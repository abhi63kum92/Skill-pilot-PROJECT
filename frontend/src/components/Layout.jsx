import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import {
  LayoutDashboard, User, Map, Brain, BookOpen,
  BarChart3, LogOut, Bell, ChevronRight, Landmark, Menu, X,
  Terminal, Award, Languages, ShieldCheck, Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
const getNavItems = (t) => [
  { path: '/dashboard', icon: LayoutDashboard, label: t?.nav?.dashboard || 'Dashboard' },
  { path: '/profile', icon: User, label: t?.nav?.profile || 'My Profile' },
  { path: '/igot-hub', icon: ShieldCheck, label: 'iGOT & NSSTA Hub', highlight: true },
  { path: '/learning-path', icon: Map, label: t?.nav?.learningPath || 'Learning Path' },
  { path: '/courses', icon: BookOpen, label: t?.nav?.courses || 'Course Catalog' },
  { path: '/mcq-generator', icon: Brain, label: t?.nav?.quizGen || 'Quiz Generator' },
  { path: '/lab', icon: Terminal, label: t?.nav?.virtualLab || 'Virtual Lab' },
  { path: '/certificates', icon: Award, label: t?.nav?.certificates || 'Certificates' },
];

const getAdminItems = (t) => [
  { path: '/admin', icon: BarChart3, label: t?.nav?.admin || 'Admin Dashboard' },
];

import { useIntelligence } from '../context/IntelligenceContext';
import { assessCompetencies } from '../services/api';
import toast from 'react-hot-toast';

const DEMO_PERSONAS = [
  {
    email: 'officer@mospi.gov.in',
    name: 'Rajesh Kumar',
    designation: 'Statistical Officer (NSO)',
    role: 'learner',
    avatar: 'RK',
    department: 'NSO',
    experience: 5,
    qualification: 'M.Sc Statistics',
    competencies: {
      Statistical: { 'Survey Design': 3, 'Sampling Methods': 2, 'National Accounts': 2, 'Price Statistics': 1, 'Labour Statistics': 2, 'Agricultural Statistics': 1, 'Industrial Statistics': 1, 'SDG Indicators': 2, 'Metadata Standards': 1, 'Data Quality': 2 },
      Technical: { 'Python': 1, 'R Language': 2, 'SQL': 2, 'Stata': 3, 'SPSS': 2, 'GIS': 1, 'Data Visualization': 2, 'AI/ML Basics': 1, 'Cloud Computing': 1, 'APIs & Integration': 1 },
      'Digital Governance': { 'Cybersecurity': 2, 'Data Privacy': 2, 'Digital Signatures': 1, 'Government Cloud': 1, 'Digital Public Infrastructure': 2, 'Open Data': 2 },
      Behavioural: { 'Leadership': 3, 'Communication': 3, 'Project Management': 2, 'Ethics & Integrity': 4, 'Decision Making': 3, 'Change Management': 2 },
    }
  },
  {
    email: 'trainee@mospi.gov.in',
    name: 'Anil Verma',
    designation: 'Junior Officer (Agriculture)',
    role: 'learner',
    avatar: 'AV',
    department: 'Agriculture',
    experience: 1,
    qualification: 'B.Sc Statistics',
    competencies: {
      Statistical: { 'Survey Design': 1, 'Sampling Methods': 1, 'National Accounts': 1, 'Price Statistics': 1, 'Labour Statistics': 1, 'Agricultural Statistics': 3, 'Industrial Statistics': 1, 'SDG Indicators': 1, 'Metadata Standards': 1, 'Data Quality': 1 },
      Technical: { 'Python': 1, 'R Language': 1, 'SQL': 1, 'Stata': 1, 'SPSS': 1, 'GIS': 3, 'Data Visualization': 1, 'AI/ML Basics': 0, 'Cloud Computing': 0, 'APIs & Integration': 0 },
      'Digital Governance': { 'Cybersecurity': 1, 'Data Privacy': 1, 'Digital Signatures': 1, 'Government Cloud': 1, 'Digital Public Infrastructure': 1, 'Open Data': 1 },
      Behavioural: { 'Leadership': 1, 'Communication': 2, 'Project Management': 1, 'Ethics & Integrity': 3, 'Decision Making': 2, 'Change Management': 1 },
    }
  },
  {
    email: 'admin@mospi.gov.in',
    name: 'Dr. Priya Sharma',
    designation: 'Director (Admin / DIID)',
    role: 'admin',
    avatar: 'PS',
    department: 'DIID',
    experience: 15,
    qualification: 'Ph.D Economics',
    competencies: {
      Statistical: { 'Survey Design': 4, 'Sampling Methods': 4, 'National Accounts': 4, 'Price Statistics': 4, 'Labour Statistics': 3, 'Agricultural Statistics': 3, 'Industrial Statistics': 3, 'SDG Indicators': 4, 'Metadata Standards': 4, 'Data Quality': 4 },
      Technical: { 'Python': 3, 'R Language': 3, 'SQL': 4, 'Stata': 4, 'SPSS': 4, 'GIS': 3, 'Data Visualization': 4, 'AI/ML Basics': 3, 'Cloud Computing': 3, 'APIs & Integration': 3 },
      'Digital Governance': { 'Cybersecurity': 4, 'Data Privacy': 4, 'Digital Signatures': 3, 'Government Cloud': 3, 'Digital Public Infrastructure': 4, 'Open Data': 4 },
      Behavioural: { 'Leadership': 4, 'Communication': 4, 'Project Management': 4, 'Ethics & Integrity': 4, 'Decision Making': 4, 'Change Management': 4 },
    }
  }
];

// Bottom nav items for mobile (most important ones)
const BOTTOM_NAV = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/learning-path', icon: Map, label: 'Path' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
  { path: '/mcq-generator', icon: Brain, label: 'Quiz' },
];

export default function Layout() {
  const { user, login, updateUser, logout } = useAuth();
  const { updateAssessment } = useIntelligence();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  // On desktop: sidebar collapses to icons. On mobile: sidebar slides in/out as drawer
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname]);

  const switchPersona = async (persona) => {
    updateUser(persona);
    if (persona.competencies) {
      localStorage.setItem(`skillpilot_comp_${persona.email}`, JSON.stringify(persona.competencies));
      const res = await assessCompetencies(persona, persona.competencies);
      updateAssessment(res);
    }
    toast.success(`Switched role to ${persona.name} (${persona.designation})`);
    if (persona.role === 'admin') {
      navigate('/admin');
    } else if (location.pathname === '/admin') {
      navigate('/dashboard');
    }
  };

  const navItems = getNavItems(t);
  const adminItems = getAdminItems(t);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sidebar width
  const sidebarWidth = isMobile ? '280px' : (sidebarOpen ? '260px' : '72px');

  return (
    <div className="layout" style={{ position: 'relative' }}>

      {/* ── Mobile Overlay ─────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside
        className="sidebar"
        style={{
          width: sidebarWidth,
          transform: isMobile
            ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
            : 'translateX(0)',
          transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 100,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: '12px',
          position: 'relative',
        }}>
          <div style={{
            width: '40px', height: '40px', flexShrink: 0,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(30, 58, 138, 0.4)'
          }}>
            <Landmark size={20} color="white" />
          </div>
          {(sidebarOpen || isMobile) && (
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9' }}>
                SkillPilot
              </div>
              <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.1em' }}>
                AI LEARNING PLATFORM
              </div>
            </div>
          )}
          {/* Close button on mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#94a3b8', cursor: 'pointer',
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ path, icon: Icon, label, highlight }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: (sidebarOpen || isMobile) ? '11px 14px' : '11px',
                  borderRadius: '10px',
                  background: active ? 'rgba(99,102,241,0.15)' : highlight ? 'rgba(6,182,212,0.06)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : highlight ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                  color: active ? '#818cf8' : highlight ? '#22d3ee' : '#94a3b8',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  justifyContent: (sidebarOpen || isMobile) ? 'flex-start' : 'center',
                }}>
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {(sidebarOpen || isMobile) && (
                    <span style={{ fontSize: '0.875rem', fontWeight: active || highlight ? 600 : 400 }}>{label}</span>
                  )}
                  {highlight && (sidebarOpen || isMobile) && (
                    <span style={{
                      marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700,
                      background: 'rgba(6,182,212,0.2)', color: '#22d3ee',
                      padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(6,182,212,0.3)'
                    }}>iGOT</span>
                  )}
                  {active && !highlight && (sidebarOpen || isMobile) && (
                    <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                  )}
                </div>
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div style={{
                padding: '12px 14px 4px',
                fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '0.1em',
                display: (sidebarOpen || isMobile) ? 'block' : 'none'
              }}>
                ADMINISTRATION
              </div>
              {adminItems.map(({ path, icon: Icon, label }) => {
                const active = location.pathname === path;
                return (
                  <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: (sidebarOpen || isMobile) ? '11px 14px' : '11px',
                      borderRadius: '10px',
                      background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
                      border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                      color: active ? '#22d3ee' : '#94a3b8',
                      transition: 'all 0.2s',
                      justifyContent: (sidebarOpen || isMobile) ? 'flex-start' : 'center',
                    }}>
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      {(sidebarOpen || isMobile) && (
                        <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}>{label}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User section */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: '34px', height: '34px', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white'
            }}>
              {user?.avatar || user?.name?.[0] || '?'}
            </div>
            {(sidebarOpen || isMobile) && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 500 }}>
                  {user?.role === 'admin' ? '👑 Admin' : '🎓 Learner'}
                </div>
              </div>
            )}
            {(sidebarOpen || isMobile) && (
              <button onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: 'absolute', top: '22px', right: '-12px',
              width: '24px', height: '24px',
              background: '#16161f', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8', zIndex: 101,
            }}
          >
            {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
          </button>
        )}
      </aside>

      {/* ── Main Content ───────────────────────────────── */}
      <div
        className="main-content"
        style={{
          marginLeft: isMobile ? '0' : (sidebarOpen ? '260px' : '72px'),
          transition: 'margin 0.35s cubic-bezier(0.4,0,0.2,1)',
          paddingBottom: isMobile ? '72px' : '0', // space for bottom nav on mobile
        }}
      >
        {/* ── Top Nav ──────────────────────────────────── */}
        <header className="topnav" style={{
          padding: '0 16px',
          gap: '8px',
        }}>

          {/* Left: Hamburger (mobile) + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: '9px', color: '#818cf8', cursor: 'pointer',
                  width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Menu size={18} />
              </button>
            )}
            <div>
              <div style={{ fontSize: '0.7rem', color: '#475569', display: isMobile ? 'none' : 'block' }}>
                Ministry of Statistics & PI
              </div>
              <div style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
                {isMobile ? 'SkillPilot' : 'iGOT Karmayogi Integration'}
              </div>
            </div>
          </div>

          {/* Center: Demo Persona Switcher (hidden on mobile) */}
          {!isMobile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.02)', padding: '4px 8px',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={12} color="#818cf8" /> Demo:
              </span>
              {DEMO_PERSONAS.map(p => (
                <button
                  key={p.email}
                  onClick={() => switchPersona(p)}
                  className={`role-tag ${user?.email === p.email ? 'active' : ''}`}
                  style={{
                    border: user?.email === p.email ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.08)',
                    background: user?.email === p.email ? 'rgba(99,102,241,0.25)' : 'transparent',
                    color: user?.email === p.email ? '#c7d2fe' : '#94a3b8'
                  }}
                >
                  <span>{p.avatar}</span>
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Right: Lang + Notif + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleLang}
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: '0.75rem', borderColor: 'rgba(99,102,241,0.3)',
                background: 'rgba(99,102,241,0.08)', color: '#818cf8',
                padding: isMobile ? '6px 8px' : '6px 12px',
              }}
              title="Change Language"
            >
              <Languages size={14} />
              {!isMobile && <span>{lang === 'en' ? '🇮🇳 हिन्दी' : '🌐 English'}</span>}
            </button>

            <button 
              onClick={() => {
                toast('Your iGOT Karmayogi profile is synced.', { icon: '✅' });
                setTimeout(() => toast('Reminder: Complete DPDP Act 2023 course.', { icon: '🔔' }), 500);
              }}
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', color: '#94a3b8', padding: '8px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              title="View Notifications"
            >
              <Bell size={18} />
              <span className="notif-dot" style={{ position: 'absolute', top: '6px', right: '6px' }} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>

      {/* ── Mobile Bottom Navigation ───────────────────── */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: '64px',
          background: 'rgba(17,17,24,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          zIndex: 98,
          boxShadow: '0 -8px 30px rgba(0,0,0,0.4)',
        }}>
          {BOTTOM_NAV.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{ textDecoration: 'none', flex: 1 }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '3px', padding: '8px 4px',
                  color: active ? '#818cf8' : '#475569',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}>
                  {active && (
                    <div style={{
                      position: 'absolute', top: '-1px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '32px', height: '3px',
                      background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                      borderRadius: '0 0 3px 3px',
                    }} />
                  )}
                  <div style={{
                    width: '36px', height: '36px',
                    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.6rem', fontWeight: active ? 600 : 400 }}>{label}</span>
                </div>
              </Link>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '3px', padding: '8px 4px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#475569',
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Menu size={18} />
            </div>
            <span style={{ fontSize: '0.6rem' }}>More</span>
          </button>
        </nav>
      )}

      {/* AI Chatbot */}
      <Chatbot />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
