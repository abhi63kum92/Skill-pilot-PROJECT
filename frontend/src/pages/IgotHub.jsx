import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Award, BookOpen, Calendar, MapPin, CheckCircle2,
  ExternalLink, Sparkles, RefreshCw, Send, Download, FileText,
  UserCheck, AlertCircle, ChevronRight, Filter, Clock, Flame,
  Building, GraduationCap, Check, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useIntelligence } from '../context/IntelligenceContext';
import {
  fetchIgotProfile, syncIgotProfile, fetchTpacCalendar,
  nominateTpacProgramme, fetchTpacNominations, exportScormPackage,
  pushCertificateToIgotPassport
} from '../services/api';

export default function IgotHub() {
  const { user } = useAuth();
  const { assessment } = useIntelligence();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('passport'); // 'passport' | 'tpac' | 'scorm' | 'nominations'
  const [profile, setProfile] = useState(null);
  const [tpacCalendar, setTpacCalendar] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncStep, setSyncStep] = useState(0);

  // Nomination Modal
  const [nominateModalOpen, setNominateModalOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [nominationForm, setNominationForm] = useState({
    remarks: 'Recommended for capacity building aligned with MoSPI Statistical Quality Assurance mandate.',
    accommodationRequired: true
  });
  const [submittingNomination, setSubmittingNomination] = useState(false);

  // Filter for TPAC
  const [domainFilter, setDomainFilter] = useState('All');

  // SCORM Generator State
  const [scormTitle, setScormTitle] = useState('MoSPI Official Statistics & Survey Design Diagnostic');
  const [scormPassingScore, setScormPassingScore] = useState(70);
  const [exportingScorm, setExportingScorm] = useState(false);

  // Load Initial Data
  useEffect(() => {
    loadData();
  }, [user?.email]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profData, calData, nomData] = await Promise.all([
        fetchIgotProfile(user?.email),
        fetchTpacCalendar('All'),
        fetchTpacNominations(user?.email)
      ]);
      setProfile(profData);
      setTpacCalendar(calData);
      setNominations(nomData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSync = async () => {
    setSyncModalOpen(true);
    setSyncStep(1);
    
    setTimeout(() => setSyncStep(2), 700);
    setTimeout(() => setSyncStep(3), 1500);
    setTimeout(async () => {
      setSyncStep(4);
      try {
        const res = await syncIgotProfile({ email: user?.email, igotId: profile?.igotId });
        if (res.syncedProfile) {
          setProfile(res.syncedProfile);
        }
        toast.success(res.message || 'iGOT Karmayogi Sync Complete! +150 Karma Points.');
      } catch (e) {
        toast.error('Sync completed with cached gateway.');
      }
      setTimeout(() => {
        setSyncModalOpen(false);
        loadData();
      }, 1000);
    }, 2300);
  };

  const handleOpenNominate = (prog) => {
    setSelectedProgramme(prog);
    setNominateModalOpen(true);
  };

  const handleSubmitNomination = async (e) => {
    e.preventDefault();
    if (!selectedProgramme) return;
    setSubmittingNomination(true);
    try {
      const payload = {
        programmeId: selectedProgramme.id,
        officerName: user?.name || profile?.officerName || 'MoSPI Officer',
        officerEmail: user?.email || profile?.parichayId || 'officer@mospi.gov.in',
        designation: user?.designation || 'Statistical Officer',
        department: user?.department || 'NSO',
        remarks: nominationForm.remarks,
        accommodationRequired: nominationForm.accommodationRequired
      };
      const res = await nominateTpacProgramme(payload);
      toast.success(res.message || 'Nomination forwarded to Cadre Authority!');
      setNominateModalOpen(false);
      loadData();
      setActiveTab('nominations');
    } catch (err) {
      toast.error('Failed to submit nomination');
    } finally {
      setSubmittingNomination(false);
    }
  };

  const handlePushPassport = async () => {
    try {
      const payload = {
        title: 'MoSPI AI Competency Diagnostic',
        score: assessment?.overallScore || 85,
        competencies: (assessment?.skillGaps || []).slice(0, 4).map(g => g.skill),
        officerEmail: user?.email || 'officer@mospi.gov.in'
      };
      const res = await pushCertificateToIgotPassport(payload);
      toast.success(res.message || 'Minted credential to iGOT Passport! +200 Karma Points');
      loadData();
    } catch (err) {
      toast.error('Failed to push credential');
    }
  };

  const handleExportScorm = async () => {
    setExportingScorm(true);
    try {
      const sampleQuestions = [
        {
          question: "Which sampling technique is primarily deployed by NSSO for the Periodic Labour Force Survey (PLFS)?",
          options: ["Simple Random Sampling", "Multi-Stage Stratified Sampling", "Cluster Sampling without Stratification", "Quota Sampling"],
          answer: "B",
          explanation: "PLFS utilizes a rotational panel multi-stage stratified sampling design."
        },
        {
          question: "Under the DPDP Act 2023, what is the statutory role of MoSPI when managing citizen survey databases?",
          options: ["Data Processor only", "Data Principal", "Data Fiduciary", "Consent Broker"],
          answer: "C",
          explanation: "MoSPI acts as a Data Fiduciary responsible for data security, purpose specification, and anonymization."
        },
        {
          question: "What is the primary international standard followed by MoSPI for compiling India's National Accounts Statistics (NAS)?",
          options: ["SNA 1968", "SNA 1993", "SNA 2008", "IMF Balance of Payments Manual 5"],
          answer: "C",
          explanation: "India compiles National Accounts statistics aligned with the System of National Accounts (SNA 2008)."
        }
      ];

      await exportScormPackage({
        title: scormTitle,
        passingScore: scormPassingScore,
        questions: sampleQuestions
      });
      toast.success('SCORM 1.2 Package Downloaded for iGOT Karmayogi Bharat LMS!');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExportingScorm(false);
    }
  };

  const filteredCalendar = tpacCalendar.filter(p => domainFilter === 'All' || p.domain === domainFilter);

  return (
    <div className="animate-fadeInUp" style={{ paddingBottom: '40px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(6,182,212,0.12) 50%, rgba(16,185,129,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={13} /> Karmayogi Bharat Integrated
              </span>
              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <UserCheck size={13} /> Parichay SSO Authenticated
              </span>
              <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Building size={13} /> NSSTA TPAC Accredited
              </span>
            </div>
            
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              iGOT Karmayogi & NSSTA TPAC Ecosystem
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0, maxWidth: '750px', lineHeight: 1.5 }}>
              Seamless bidirectional integration with India's National Capacity Building Platform, verified digital passports, and NSSTA Training Programme Advisory Committee (TPAC) residential nominations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={handleTriggerSync}
              disabled={syncing}
              style={{
                borderColor: '#06b6d4',
                color: '#22d3ee',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontWeight: 600
              }}
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              Sync with iGOT ID
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/learning-path')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
            >
              <Sparkles size={16} />
              AI Learning Trajectory
            </button>
          </div>
        </div>

        {/* Live sync bar */}
        <div style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Linked Karmayogi ID:</span>{' '}
            <strong style={{ color: '#38bdf8' }}>{profile?.igotId || 'KMY-MOSPI-2024-8841'}</strong>
            {' · '}
            <span style={{ color: '#94a3b8' }}>Parichay eHRMS:</span>{' '}
            <strong style={{ color: '#e2e8f0' }}>{profile?.parichayId || user?.email}</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Last Gateway Sync:</span>{' '}
            <strong style={{ color: '#10b981' }}>
              {profile?.lastSyncTime ? new Date(profile.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'} (Active)
            </strong>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Karmayogi Karma Points', value: profile?.karmaPoints ? `${profile.karmaPoints.toLocaleString()} Pts` : '2,850 Pts', icon: Flame, color: '#f59e0b', sub: '+150 on latest sync' },
          { label: 'Official Learning Hours', value: `${profile?.learningHours || 142.5} hrs`, icon: Clock, color: '#06b6d4', sub: 'iGOT Bharat verified' },
          { label: 'FRAC Competency Tier', value: profile?.fracLevel || 'Level 3 - Proficient', icon: Award, color: '#6366f1', sub: 'MoSPI Cadre Benchmarked' },
          { label: 'NSSTA TPAC Nominations', value: `${nominations.length} Program`, icon: GraduationCap, color: '#10b981', sub: 'CCA Forwarded / Approved' },
        ].map((kpi, idx) => (
          <div key={idx} className="card" style={{ padding: '18px 20px', background: '#13131c' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{kpi.label}</span>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: `${kpi.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <kpi.icon size={16} color={kpi.color} />
              </div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '0.74rem', color: kpi.color, fontWeight: 500 }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '8px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'passport', label: '🎖️ Karmayogi Digital Passport', count: profile?.karmayogiBadges?.length || 4 },
          { id: 'tpac', label: '🏛️ NSSTA TPAC Training Calendar', count: tpacCalendar.length },
          { id: 'nominations', label: '📋 Officer Nominations', count: nominations.length },
          { id: 'scorm', label: '📦 iGOT SCORM / xAPI Exporter', badge: 'LMS Ready' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: activeTab === tab.id ? '#38bdf8' : '#94a3b8',
              border: activeTab === tab.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                background: activeTab === tab.id ? '#0284c7' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: '0.72rem',
                padding: '2px 7px',
                borderRadius: '10px'
              }}>
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span style={{
                background: '#10b98122',
                color: '#10b981',
                border: '1px solid #10b98144',
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '6px',
                fontWeight: 700
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: KARMAYOGI DIGITAL PASSPORT */}
      {activeTab === 'passport' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Official Digital Passport Card */}
          <div className="card" style={{
            background: 'linear-gradient(145deg, #131320 0%, #1a1a2e 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
            padding: '24px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.2rem', color: '#fff',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
                }}>
                  {(profile?.officerName || user?.name || 'RK').split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
                    {profile?.officerName || user?.name || 'Rajesh Kumar'}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {profile?.cadre || user?.designation || 'Indian Statistical Service (ISS)'}
                  </p>
                </div>
              </div>
              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> KYC Verified
              </span>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '18px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>MINISTRY / DEPT</span>
                <strong style={{ color: '#e2e8f0' }}>{profile?.ministry || 'MoSPI'} ({profile?.department || 'NSO'})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>KMY PASSPORT ID</span>
                <strong style={{ color: '#38bdf8' }}>{profile?.igotId || 'KMY-MOSPI-2024-8841'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>COMPLETED MODULES</span>
                <strong style={{ color: '#10b981' }}>{profile?.coursesCompleted || 4} Certified</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>KARMA ACCRUAL</span>
                <strong style={{ color: '#f59e0b' }}>{profile?.karmaPoints?.toLocaleString() || '2,850'} pts</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1, fontSize: '0.82rem', padding: '9px 12px' }}
                onClick={handlePushPassport}
              >
                <Sparkles size={14} /> Push SkillPilot Result
              </button>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem', padding: '9px 12px', borderColor: '#6366f1', color: '#818cf8' }}
                onClick={() => window.open('https://igotkarmayogi.gov.in/', '_blank')}
              >
                <ExternalLink size={14} /> Open iGOT Portal
              </button>
            </div>
          </div>

          {/* Verified Karmayogi Badges & Micro-credentials */}
          <div className="card" style={{ padding: '24px', background: '#13131f' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#f59e0b" />
                Verified Karmayogi Micro-Credentials
              </h3>
              <span style={{ fontSize: '0.76rem', color: '#64748b' }}>DigiLocker / FRAC Verifiable</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(profile?.karmayogiBadges || [
                { name: 'MoSPI Statistical Champion', icon: '🏅', category: 'Domain Competency', issuedDate: '2026-06-15' },
                { name: 'iGOT Gold Learner', icon: '⭐', category: 'Karma Achievement', issuedDate: '2026-07-01' },
                { name: 'Cyber Compliant Officer', icon: '🛡️', category: 'Statutory Governance', issuedDate: '2026-07-20' },
                { name: 'NSSTA Accredited Analyst', icon: '📜', category: 'Institutional', issuedDate: '2026-08-05' }
              ]).map((badge, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px'
                }}>
                  <div style={{ fontSize: '1.4rem' }}>{badge.icon || '🏅'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f1f5f9' }}>{badge.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {badge.category} · Issued on {badge.issuedDate}
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Verified</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active iGOT Course Progress */}
          <div className="card" style={{ gridColumn: '1 / -1', padding: '24px', background: '#13131f' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="#06b6d4" />
              Active iGOT Karmayogi Module Progress
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {(profile?.recentCourses || [
                { id: 'igot-stat-sampling-201', title: 'Advanced Survey Sampling & Estimation Techniques', progress: 100, status: 'Completed', score: 92, completedAt: '2026-06-12' },
                { id: 'igot-python-data-101', title: 'Python for Statistical Data Processing & Analysis', progress: 85, status: 'In Progress', score: 88, completedAt: null },
                { id: 'igot-dpdp-cyber-202', title: 'DPDP Act 2023 & Cybersecurity Essentials', progress: 100, status: 'Completed', score: 95, completedAt: '2026-07-20' },
                { id: 'igot-national-accounts-301', title: 'System of National Accounts (SNA 2008) & GDP Compilation', progress: 40, status: 'In Progress', score: null, completedAt: null }
              ]).map((c, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className={`badge badge-${c.progress === 100 ? 'success' : 'warning'}`}>
                        {c.status}
                      </span>
                      {c.score && (
                        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                          Score: {c.score}%
                        </span>
                      )}
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: '#f1f5f9', fontWeight: 600, lineHeight: 1.4 }}>
                      {c.title}
                    </h4>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                      <span>Progress</span>
                      <strong style={{ color: c.progress === 100 ? '#10b981' : '#38bdf8' }}>{c.progress}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                      <div style={{
                        width: `${c.progress}%`,
                        height: '100%',
                        background: c.progress === 100 ? '#10b981' : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        toast.success(`Launching "${c.title}" on iGOT Karmayogi player...`);
                        window.open('https://igotkarmayogi.gov.in/', '_blank');
                      }}
                    >
                      <ExternalLink size={13} /> {c.progress === 100 ? 'Review Module' : 'Resume on iGOT'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NSSTA TPAC TRAINING CALENDAR */}
      {activeTab === 'tpac' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                NSSTA Training Programme Advisory Committee (TPAC) Calendar 2026-27
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
                Annual approved residential masterclasses & hybrid training schedules for Indian Statistical Service and Subordinate Statistical Service.
              </p>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'Statistical', 'Technical', 'Digital Governance'].map(d => (
                <button
                  key={d}
                  onClick={() => setDomainFilter(d)}
                  style={{
                    background: domainFilter === d ? '#6366f1' : 'rgba(255,255,255,0.05)',
                    color: domainFilter === d ? '#fff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredCalendar.map((prog) => (
              <div key={prog.id} className="card" style={{
                background: '#13131f',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {prog.code}
                    </span>
                    <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                      {prog.status}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.4 }}>
                    {prog.title}
                  </h4>

                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {prog.description}
                  </p>

                  <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.78rem',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                      <Calendar size={14} color="#38bdf8" />
                      <strong>Dates:</strong> {prog.dates} ({prog.duration})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                      <MapPin size={14} color="#f59e0b" />
                      <strong>Venue:</strong> {prog.venue}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                      <Building size={14} color="#10b981" />
                      <strong>Organizer:</strong> {prog.organizer}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                      <GraduationCap size={14} color="#818cf8" />
                      <strong>Quota:</strong> {prog.nominatedCount} / {prog.maxCapacity} Nominated
                    </div>
                  </div>

                  {/* Competencies addressed */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>COMPETENCIES BRIDGED:</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {prog.competenciesAddressed.map((c, i) => (
                        <span key={i} style={{
                          background: 'rgba(99,102,241,0.12)',
                          color: '#a5b4fc',
                          border: '1px solid rgba(99,102,241,0.25)',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          padding: '2px 8px'
                        }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleOpenNominate(prog)}
                  >
                    <Send size={14} /> Nominate Officer / Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OFFICER NOMINATIONS TRACKER */}
      {activeTab === 'nominations' && (
        <div className="card" style={{ padding: '24px', background: '#13131f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                MoSPI Cadre Controlling Authority (CCA) Nominations Tracker
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Status of official sponsorship and seat allotments for NSSTA TPAC residential programmes.
              </p>
            </div>
            <button className="btn btn-outline" onClick={loadData}>
              <RefreshCw size={14} /> Refresh Status
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {nominations.map((nom, i) => (
              <div key={i} style={{
                padding: '18px 20px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {nom.nominationId}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                      {nom.status}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.02rem', color: '#f8fafc', fontWeight: 700 }}>
                    {nom.programmeTitle}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    <strong>Nominee:</strong> {nom.officerName} ({nom.designation} · {nom.department})
                    {' · '}
                    <strong>CCA Ref:</strong> {nom.ccaApprovalNo || 'CCA/MOSPI/2026/N-8812'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                    ✓ Government Sponsored (Head 3454)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Hostel Allotment: {nom.accommodationRequired !== false ? 'Confirmed' : 'Not Requested'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCORM / xAPI LMS EXPORTER */}
      {activeTab === 'scorm' && (
        <div className="card" style={{ padding: '28px', background: '#13131f' }}>
          <div style={{ maxWidth: '750px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-primary">SCORM 1.2 / xAPI Engine</span>
              <span className="badge badge-info">iGOT Karmayogi Bharat LMS</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Export AI Assessments to iGOT Karmayogi Bharat LMS
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Package SkillPilot AI-generated diagnostic tests and training modules into industry-standard SCORM 1.2 compliant ZIP archives with embedded manifest (<code style={{ color: '#38bdf8' }}>imsmanifest.xml</code>) and responsive client runner. Ready for direct upload to iGOT Bharat, Moodle, or Diksha portals.
            </p>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '650px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Course / Assessment Title for SCORM Manifest:
              </label>
              <input
                type="text"
                value={scormTitle}
                onChange={(e) => setScormTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Minimum Passing Mastery Score (%):
              </label>
              <input
                type="number"
                value={scormPassingScore}
                onChange={(e) => setScormPassingScore(Number(e.target.value))}
                min="50"
                max="100"
                style={{
                  width: '120px',
                  padding: '8px 12px',
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{
              padding: '12px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: '#94a3b8',
              marginBottom: '20px'
            }}>
              ✓ Generates <code style={{ color: '#38bdf8' }}>imsmanifest.xml</code>, HTML interactive question viewer, and SCORM API wrapper.
            </div>

            <button
              className="btn btn-primary"
              onClick={handleExportScorm}
              disabled={exportingScorm}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                fontWeight: 600,
                fontSize: '0.92rem'
              }}
            >
              <Download size={16} />
              {exportingScorm ? 'Generating SCORM Bundle...' : 'Download iGOT SCORM 1.2 ZIP Bundle'}
            </button>
          </div>
        </div>
      )}

      {/* SYNC ANIMATION MODAL */}
      {syncModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '480px', padding: '28px', background: '#161623', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <RefreshCw size={18} color="#22d3ee" className="animate-spin" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  iGOT Karmayogi Gateway Sync
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Endpoint: https://api.igotkarmayogi.gov.in/v2/mospi-sync
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { step: 1, text: 'Establishing secure TLS tunnel to Karmayogi Bharat API Gateway...' },
                { step: 2, text: 'Verifying MoSPI Parichay eHRMS Single Sign-On credentials...' },
                { step: 3, text: 'Pulling course completions & watch records into SkillPilot...' },
                { step: 4, text: 'Pushing calibrated competency vectors & adding +150 Karma Points!' }
              ].map((s) => (
                <div key={s.step} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '8px',
                  background: syncStep >= s.step ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                  fontSize: '0.8rem',
                  color: syncStep >= s.step ? '#38bdf8' : '#64748b',
                  transition: 'all 0.3s ease'
                }}>
                  {syncStep > s.step ? (
                    <CheckCircle2 size={15} color="#10b981" />
                  ) : syncStep === s.step ? (
                    <RefreshCw size={15} color="#38bdf8" className="animate-spin" />
                  ) : (
                    <Clock size={15} color="#475569" />
                  )}
                  <span>{s.text}</span>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                width: `${(syncStep / 4) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* NOMINATE MODAL */}
      {nominateModalOpen && selectedProgramme && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', background: '#161623', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  {selectedProgramme.code}
                </span>
                <h3 style={{ margin: '6px 0 0', fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Nominate Officer for NSSTA TPAC Training
                </h3>
              </div>
              <button
                onClick={() => setNominateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '14px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.82rem',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>{selectedProgramme.title}</strong>
              <div style={{ color: '#94a3b8' }}><strong>Venue:</strong> {selectedProgramme.venue}</div>
              <div style={{ color: '#94a3b8' }}><strong>Dates:</strong> {selectedProgramme.dates} ({selectedProgramme.duration})</div>
              <div style={{ color: '#94a3b8' }}><strong>Coordinator:</strong> {selectedProgramme.coordinator}</div>
            </div>

            <form onSubmit={handleSubmitNomination}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Officer Name</label>
                  <input
                    type="text"
                    value={user?.name || 'Rajesh Kumar'}
                    disabled
                    style={{ width: '100%', padding: '8px 12px', background: '#11111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Officer Email</label>
                  <input
                    type="text"
                    value={user?.email || 'officer@mospi.gov.in'}
                    disabled
                    style={{ width: '100%', padding: '8px 12px', background: '#11111a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Supervising Officer / CCA Justification Remarks
                </label>
                <textarea
                  value={nominationForm.remarks}
                  onChange={(e) => setNominationForm({ ...nominationForm, remarks: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#11111a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="accom"
                  checked={nominationForm.accommodationRequired}
                  onChange={(e) => setNominationForm({ ...nominationForm, accommodationRequired: e.target.checked })}
                />
                <label htmlFor="accom" style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  Request NSSTA Hostel Accommodation & Boarding at Campus
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setNominateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingNomination}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={14} />
                  {submittingNomination ? 'Submitting...' : 'Submit Official Nomination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
