import { Brain, BookOpen, Bot, DatabaseZap, FileQuestion, Gauge, LockKeyhole, Network, ShieldCheck } from 'lucide-react';

const modules = [
  {
    icon: Brain,
    title: 'AI Competency Assessment',
    endpoint: 'POST /api/assess',
    proof: 'Role, department, experience and self-rated competencies are compared with Official Statistics targets.',
    tags: ['Statistical', 'Technical', 'Digital Governance', 'Behavioural'],
  },
  {
    icon: Gauge,
    title: 'Automated Skill-Gap Analysis',
    endpoint: 'Gap scoring engine',
    proof: 'Each skill receives current level, required level, gap size and priority.',
    tags: ['Critical gaps', 'Priority score', 'Domain score'],
  },
  {
    icon: BookOpen,
    title: 'Personalized Learning Pathways',
    endpoint: 'Recommendation engine',
    proof: 'Courses are ranked by match percentage and linked to missing competencies.',
    tags: ['iGOT', 'NSSTA TPAC', 'Career progression'],
  },
  {
    icon: Network,
    title: 'iGOT Karmayogi Integration Ready',
    endpoint: 'GET /api/courses',
    proof: 'The API boundary is ready for iGOT catalogue, enrollment, completion status and score sync.',
    tags: ['Course catalog', 'Enrollment', 'Completion sync'],
  },
  {
    icon: FileQuestion,
    title: 'AI MCQ and Quiz Generation',
    endpoint: 'POST /api/generate-mcqs',
    proof: 'Uploaded TXT, PDF, DOCX and PPTX files are parsed and converted into MCQs with answers and explanations.',
    tags: ['Gemini LLM', 'NLP', 'Instant feedback'],
  },
  {
    icon: DatabaseZap,
    title: 'Analytics Dashboards',
    endpoint: 'Learner and admin views',
    proof: 'Learners see personal gaps; admins see workforce distribution, demand prediction and training impact.',
    tags: ['Progress', 'Prediction', 'Training effectiveness'],
  },
  {
    icon: Bot,
    title: 'AI Learner Support',
    endpoint: 'Assistant workflow',
    proof: 'Guidance is embedded into learning recommendations, quiz explanations and next-step prompts.',
    tags: ['Virtual assistant', 'Feedback', 'Adaptive learning'],
  },
  {
    icon: LockKeyhole,
    title: 'Secure and Scalable Design',
    endpoint: 'RBAC + API layer',
    proof: 'Role-based learner/admin routing, backend key isolation, CORS boundary and cloud-ready FastAPI service.',
    tags: ['SSO ready', 'RBAC', 'Data privacy'],
  },
];

const domains = [
  ['Statistical', 'Survey Design, Sampling, National Accounts, SDG Indicators, Data Quality'],
  ['Technical', 'Python, R, SQL, GIS, AI/ML, Cloud, APIs, Data Visualization'],
  ['Digital Governance', 'Cybersecurity, Data Privacy, Digital Signatures, Government Cloud, DPI'],
  ['Behavioural', 'Leadership, Communication, Project Management, Ethics, Change Management'],
];

export default function SolutionBlueprint() {
  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <h1 className="page-title">Solution Map</h1>
        <p className="page-subtitle">Problem statement requirements mapped to working SkillPilot modules</p>
      </div>

      <div className="card card-glow" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <ShieldCheck size={28} color="#34d399" />
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>AI-enabled Skill Intelligence and Learning Platform</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.7 }}>
              SkillPilot creates a competency profile for officials, detects skill gaps against Official Statistics requirements,
              recommends iGOT Karmayogi and NSSTA TPAC learning paths, generates MCQs from uploaded materials, and provides
              learner/admin analytics for continuous capacity building.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {domains.map(([name, skills]) => (
          <div key={name} className="stat-card">
            <div className="stat-label">{name}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px', lineHeight: 1.6 }}>{skills}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {modules.map(({ icon: Icon, title, endpoint, proof, tags }) => (
          <div key={title} className="card">
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color="#818cf8" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>{title}</h3>
                <div className="badge badge-primary" style={{ marginBottom: '10px' }}>{endpoint}</div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '12px' }}>{proof}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {tags.map(tag => <span key={tag} className="badge badge-info">{tag}</span>)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
