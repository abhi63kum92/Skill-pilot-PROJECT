import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Clock, Star, Search, ExternalLink, Users,
  ShieldCheck, Brain, CheckCircle2, Sparkles, Filter, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useIntelligence } from '../context/IntelligenceContext';
import { COURSES_CATALOG } from '../services/api';

const domains = ['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural'];
const providers = ['All', 'iGOT Karmayogi Bharat', 'NSSTA TPAC', 'MoSPI NAD / NSSTA', 'MeitY / iGOT', 'MoSPI Price Statistics Division'];

export default function CourseCatalog() {
  const navigate = useNavigate();
  const { assessment } = useIntelligence();
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [enrolled, setEnrolled] = useState(new Set(['igot-stat-sampling-201', 'igot-python-data-101']));
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Map AI assessment recommendations to catalog courses
  const recommendedById = new Map((assessment?.recommendations || []).map(r => [r.id, r]));

  const courses = COURSES_CATALOG.map(course => {
    const matched = recommendedById.get(course.id);
    return matched ? { ...course, match: matched.match, addressedSkills: matched.addressedSkills } : { ...course, match: 70 };
  });

  const filtered = courses
    .filter(c =>
      (domainFilter === 'All' || c.domain === domainFilter) &&
      (providerFilter === 'All' || c.provider.toLowerCase().includes(providerFilter.toLowerCase().replace('all', ''))) &&
      (c.title.toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) || c.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'match') return (b.match || 0) - (a.match || 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.enrolled - a.enrolled;
    });

  const handleEnroll = (courseId, courseTitle, url) => {
    setEnrolled(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
        toast('Removed from active learning track');
      } else {
        next.add(courseId);
        toast.success(`✅ Enrolled in "${courseTitle}" on iGOT Karmayogi!`);
      }
      return next;
    });
  };

  const handleOpenIgot = (url, title) => {
    toast.success(`Opening "${title}" on iGOT Karmayogi portal`);
    window.open(url || 'https://igotkarmayogi.gov.in/', '_blank');
  };

  const levelColor = { 'Beginner': '#10b981', 'Intermediate': '#f59e0b', 'Advanced': '#ef4444', 'All Levels': '#6366f1' };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">
                <ShieldCheck size={12} /> iGOT Karmayogi Bharat Catalog
              </span>
              <span className="badge badge-warning">
                NSSTA TPAC Accredited
              </span>
            </div>
            <h1 className="page-title">iGOT Karmayogi MoSPI Course Repository</h1>
            <p className="page-subtitle">
              Verified capacity building courses curated by National Statistical Systems Training Academy & Karmayogi Bharat
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/learning-path')}>
            <Sparkles size={15} /> View My Matched Trajectory
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Catalog Courses', value: courses.length, color: '#6366f1' },
          { label: 'Active Enrolled', value: enrolled.size, color: '#10b981' },
          { label: 'MoSPI / NSSTA Specialized', value: courses.filter(c => c.provider.includes('NSSTA') || c.provider.includes('MoSPI')).length, color: '#06b6d4' },
          { label: 'iGOT Bharat Mandatory', value: courses.filter(c => c.provider.includes('iGOT')).length, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            padding: '12px 20px', background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
            display: 'flex', gap: '12px', alignItems: 'center', flex: 1, minWidth: '180px'
          }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Space Grotesk, sans-serif', color }}>{value}</span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            className="input-field"
            placeholder="Search statistical methodologies, Python, DPDP, sampling..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <select className="select-field" style={{ width: 'auto' }} value={domainFilter} onChange={e => setDomainFilter(e.target.value)}>
          {domains.map(d => <option key={d} value={d}>Domain: {d}</option>)}
        </select>

        <select className="select-field" style={{ width: 'auto' }} value={providerFilter} onChange={e => setProviderFilter(e.target.value)}>
          {providers.map(p => <option key={p} value={p}>Provider: {p}</option>)}
        </select>

        <select className="select-field" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="match">Sort: AI Gap Match %</option>
          <option value="rating">Sort: Officer Rating</option>
          <option value="enrolled">Sort: Most Enrolled</option>
        </select>
      </div>

      {/* Course Cards Grid */}
      <div className="grid-3" style={{ gap: '20px' }}>
        {filtered.map(course => {
          const isEnrolled = enrolled.has(course.id);

          return (
            <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className={`badge badge-${course.provider.includes('iGOT') ? 'primary' : 'info'}`} style={{ fontSize: '0.68rem' }}>
                  {course.provider}
                </span>

                <div style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '999px',
                  padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
                  color: course.match >= 85 ? '#34d399' : '#fbbf24'
                }}>
                  🎯 {course.match}% Gap Match
                </div>
              </div>

              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4, color: '#f8fafc' }}>
                {course.title}
              </h3>

              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5, flex: 1 }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {course.skills.map(sk => (
                  <span key={sk} className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', fontSize: '0.68rem' }}>
                    {sk}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#64748b', marginBottom: '16px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {course.duration}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} color="#fbbf24" fill="#fbbf24" /> {course.rating}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} /> {course.enrolled.toLocaleString()} learners
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                  onClick={() => handleEnroll(course.id, course.title, course.url)}
                >
                  {isEnrolled ? <><CheckCircle2 size={14} color="#10b981" /> Enrolled</> : <><BookOpen size={14} /> Enroll in Track</>}
                </button>

                <button
                  className="btn btn-outline"
                  style={{ padding: '8px 12px' }}
                  onClick={() => handleOpenIgot(course.url, course.title)}
                  title="Launch module on official iGOT Karmayogi portal"
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <BookOpen size={44} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>No iGOT courses matched your search query</div>
          <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try switching domain filters or searching for general statistical terms.</div>
        </div>
      )}
    </div>
  );
}
