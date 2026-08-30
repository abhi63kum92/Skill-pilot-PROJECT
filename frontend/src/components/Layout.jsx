import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import {
  LayoutDashboard, User, Map, Brain, BookOpen,
  BarChart3, LogOut, Bell, ChevronRight, Zap, Menu, X,
  Terminal, Award, Languages, ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

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

export default function Layout() {
  const { user, login, updateUser, logout } = useAuth();
  const { updateAssessment } = useIntelligence();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: sidebarOpen ? '260px' : '72px' }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={20} color="white" />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9' }}>
                SkillPilot
              </div>
              <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.1em' }}>
                AI LEARNING PLATFORM
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ path, icon: Icon, label, highlight }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: sidebarOpen ? '10px 14px' : '10px',
                  borderRadius: '10px',
                  background: active ? 'rgba(99,102,241,0.15)' : highlight ? 'rgba(6,182,212,0.06)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : highlight ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                  color: active ? '#818cf8' : highlight ? '#22d3ee' : '#94a3b8',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}>
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: active || highlight ? 600 : 400 }}>{label}</span>}
                  {highlight && sidebarOpen && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: 'rgba(6,182,212,0.2)',
                      color: '#22d3ee',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(6,182,212,0.3)'
                    }}>
                      iGOT
                    </span>
                  )}
                  {active && !highlight && sidebarOpen && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </div>
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div style={{ padding: '12px 14px 4px', fontSize: '0.65rem', color: '#475569', fontWeight: 700, letterSpacing: '0.1em', display: sidebarOpen ? 'block' : 'none' }}>
                ADMINISTRATION
              </div>
              {adminItems.map(({ path, icon: Icon, label }) => {
                const active = location.pathname === path;
                return (
                  <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: sidebarOpen ? '10px 14px' : '10px',
                      borderRadius: '10px',
                      background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
                      border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                      color: active ? '#22d3ee' : '#94a3b8',
                      transition: 'all 0.2s',
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    }}>
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}>{label}</span>}
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
              {user?.avatar}
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 500 }}>
                  {user?.role === 'admin' ? '👑 Admin' : '🎓 Learner'}
                </div>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                title="Logout">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
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
      </aside>

      {/* Main */}
      <div className="main-content" style={{ marginLeft: sidebarOpen ? '260px' : '72px', transition: 'margin 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Top Nav */}
        <header className="topnav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>Ministry of Statistics & PI</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
              iGOT Karmayogi Integration
            </div>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} color="#818cf8" /> Demo Persona:
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="btn btn-ghost btn-sm"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.8rem', borderColor: 'rgba(99,102,241,0.3)',
                background: 'rgba(99,102,241,0.08)', color: '#818cf8'
              }}
              title="Change Language"
            >
              <Languages size={15} />
              <span>{lang === 'en' ? '🇮🇳 हिन्दी' : '🌐 English'}</span>
            </button>

            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '8px' }}>
              <Bell size={18} />
              <span className="notif-dot" style={{ position: 'absolute', top: '6px', right: '6px' }} />
            </button>
            <div style={{
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '8px', padding: '6px 14px',
              fontSize: '0.75rem', color: '#818cf8', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Live System
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      {/* AI Chatbot - visible on all pages */}
      <Chatbot />
    </div>
  );
}
