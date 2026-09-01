import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, CheckCircle2, XCircle, Award,
  RefreshCw, ArrowLeft, Sparkles, TrendingUp, Clock, AlertCircle,
  BarChart2, BookOpen, Check, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useIntelligence } from '../context/IntelligenceContext';
import { assessCompetencies, submitQuizResults } from '../services/api';

const DEFAULT_FALLBACK_QUIZ = {
  id: 'default-quiz',
  title: 'Official Statistics & Survey Design Diagnostic Quiz',
  difficulty: 'Medium',
  questions: [
    {
      id: 1,
      question: "Which sampling method divides a population into homogeneous subgroups (strata) and samples from each?",
      options: {
        A: "Simple Random Sampling",
        B: "Stratified Sampling",
        C: "Cluster Sampling",
        D: "Systematic Sampling"
      },
      correct_answer: "B",
      explanation: "Stratified sampling ensures representation by dividing the population into homogeneous strata.",
      topic: "Sampling Methods"
    },
    {
      id: 2,
      question: "In India's official statistical architecture, which index measures retail inflation based on consumer basket goods?",
      options: {
        A: "Wholesale Price Index (WPI)",
        B: "Consumer Price Index (CPI)",
        C: "Index of Industrial Production (IIP)",
        D: "Gross Domestic Product Deflator"
      },
      correct_answer: "B",
      explanation: "CPI tracks consumer basket price changes at the retail level across rural and urban sectors.",
      topic: "Price Statistics"
    },
    {
      id: 3,
      question: "In statistical data processing with Python, which library is the industry standard for tabular data manipulation?",
      options: {
        A: "NumPy",
        B: "Pandas",
        C: "Matplotlib",
        D: "TensorFlow"
      },
      correct_answer: "B",
      explanation: "Pandas provides high-performance DataFrame data structures for microdata manipulation.",
      topic: "Python"
    },
    {
      id: 4,
      question: "What does 'Coherence' mean within official data quality management frameworks?",
      options: {
        A: "Data is released in real time",
        B: "Data is statistically consistent and comparable across sources and time",
        C: "Data is password encrypted",
        D: "Data contains no missing survey values"
      },
      correct_answer: "B",
      explanation: "Coherence ensures outputs are internally consistent and mutually comparable across datasets.",
      topic: "Data Quality"
    },
    {
      id: 5,
      question: "Which legislation provides the primary statutory framework for citizen personal data governance in India?",
      options: {
        A: "IT Act 2000 Section 66",
        B: "Digital Personal Data Protection (DPDP) Act 2023",
        C: "Right to Information Act",
        D: "Official Secrets Act"
      },
      correct_answer: "B",
      explanation: "The DPDP Act 2023 establishes legal obligations for data fiduciaries and citizen data protection.",
      topic: "Data Privacy"
    }
  ]
};

export default function QuizTake() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { updateAssessment } = useIntelligence();

  const [quiz, setQuiz] = useState(DEFAULT_FALLBACK_QUIZ);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [levelUpAwarded, setLevelUpAwarded] = useState(false);
  const [upgradedSkills, setUpgradedSkills] = useState([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Load quiz from localStorage or saved history
  useEffect(() => {
    try {
      const currentStored = localStorage.getItem('skillpilot_current_quiz');
      if (currentStored) {
        const parsed = JSON.parse(currentStored);
        if (parsed.questions && parsed.questions.length > 0) {
          setQuiz(parsed);
          return;
        }
      }

      const savedList = localStorage.getItem('skillpilot_saved_quizzes');
      if (savedList) {
        const list = JSON.parse(savedList);
        const found = list.find(q => q.id === quizId);
        if (found && found.questions && found.questions.length > 0) {
          setQuiz(found);
          return;
        }
      }
    } catch {
      // fallback to default
    }
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (showResults) return;
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showResults]);

  const questions = quiz.questions || [];
  const q = questions[currentIdx] || questions[0];
  const isLast = currentIdx === questions.length - 1;

  const handleSelect = (ansKey) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [q.id]: ansKey }));
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [q.id]: !prev[q.id] }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correct += 1;
      }
    });
    const pct = Math.round((correct / Math.max(1, questions.length)) * 100);
    return { correct, total: questions.length, percentage: pct };
  };

  const handleSubmitQuiz = async () => {
    const unansweredCount = questions.filter(quest => !selectedAnswers[quest.id]).length;
    if (unansweredCount > 0) {
      const proceed = window.confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`);
      if (!proceed) return;
    }

    setSubmitting(true);
    const scoreData = calculateScore();
    const isPassed = scoreData.percentage >= 70;

    // Collect topics from questions
    const topics = Array.from(new Set(questions.map(quest => quest.topic).filter(Boolean)));

    try {
      const submissionResult = await submitQuizResults({
        quizId: quiz.id || 'custom-quiz',
        quizTitle: quiz.title || 'MoSPI Assessment',
        scorePercentage: scoreData.percentage,
        answers: selectedAnswers,
        topics,
        userEmail: user?.email
      });

      setShowResults(true);

      if (isPassed) {
        setLevelUpAwarded(true);
        setUpgradedSkills(topics);
        toast.success(`🎉 Excellent! Score: ${scoreData.percentage}%. Level-up applied to your competency profile!`, { duration: 5000 });

        // Update competencies in localStorage and AuthContext
        if (user?.email) {
          const compKey = `skillpilot_comp_${user.email}`;
          const currentStr = localStorage.getItem(compKey);
          let userComp = currentStr ? JSON.parse(currentStr) : user.competencies || {};

          // Upgrade specific domain skills
          const updatedComp = { ...userComp };
          topics.forEach(topic => {
            // Find which domain this topic belongs to
            ['Statistical', 'Technical', 'Digital Governance', 'Behavioural'].forEach(dom => {
              if (updatedComp[dom] && updatedComp[dom][topic] !== undefined) {
                updatedComp[dom][topic] = Math.min(4, Number(updatedComp[dom][topic]) + 1);
              } else if (dom === 'Statistical' && (topic.includes('Sampling') || topic.includes('Survey') || topic.includes('Quality') || topic.includes('Price') || topic.includes('Accounts'))) {
                updatedComp.Statistical = updatedComp.Statistical || {};
                const targetKey = topic.includes('Sampling') ? 'Sampling Methods' : topic.includes('Survey') ? 'Survey Design' : topic.includes('Price') ? 'Price Statistics' : 'Data Quality';
                updatedComp.Statistical[targetKey] = Math.min(4, (Number(updatedComp.Statistical[targetKey]) || 2) + 1);
              }
            });
          });

          localStorage.setItem(compKey, JSON.stringify(updatedComp));
          updateUser({ competencies: updatedComp });

          // Generate Real Certificate
          const newCert = {
            id: 'CERT-' + Math.floor(Math.random() * 1000000),
            title: quiz.title || 'MoSPI Official Assessment',
            issuer: 'Ministry of Statistics & Programme Implementation (MoSPI) & iGOT Karmayogi',
            issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            credentialId: 'IGOT-MOSPI-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
            score: scoreData.percentage + '%',
            hours: '15 Hours',
            domain: topics[0] || 'Technical Competency'
          };
          const certKey = 'skillpilot_certs_' + user.email;
          const currentCertsStr = localStorage.getItem(certKey);
          const currentCerts = currentCertsStr ? JSON.parse(currentCertsStr) : [];
          localStorage.setItem(certKey, JSON.stringify([newCert, ...currentCerts]));

          // Refresh intelligence assessment
          const newAssessment = await assessCompetencies(user, updatedComp);
          updateAssessment(newAssessment);
        }
      } else {
        toast('Quiz completed! Review your answers below to strengthen gap areas.', { icon: '📊' });
      }
    } catch {
      setShowResults(true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Results View
  if (showResults) {
    const scoreData = calculateScore();
    const isPassed = scoreData.percentage >= 70;

    return (
      <div className="animate-fadeInUp" style={{ maxWidth: '840px', margin: '0 auto' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/mcq-generator')} style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Quiz Generator
        </button>

        {/* Score Summary Card */}
        <div
          className="card"
          style={{
            background: isPassed
              ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(99,102,241,0.1))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(99,102,241,0.05))',
            border: isPassed ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(239,68,68,0.3)',
            marginBottom: '24px',
            textAlign: 'center',
            padding: '32px 20px',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
            {isPassed ? '🏆' : '📚'}
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
            {isPassed ? 'Assessment Passed with Distinction!' : 'Assessment Completed'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '20px' }}>
            {quiz.title} · Time taken: {formatTime(secondsElapsed)}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: isPassed ? '#34d399' : '#f87171' }}>
                {scoreData.percentage}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>FINAL SCORE</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '32px' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f1f5f9' }}>
                {scoreData.correct} / {scoreData.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>CORRECT ANSWERS</div>
            </div>
          </div>

          {levelUpAwarded && (
            <div
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '10px',
                padding: '14px',
                maxWidth: '540px',
                margin: '0 auto 20px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>
                <Sparkles size={16} /> Verified Competency Level-Up
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Your performance has upgraded your proficiency in:
                <strong style={{ color: '#fff' }}> {upgradedSkills.slice(0, 3).join(', ') || 'Statistical Competencies'} (+1 Level)</strong>.
                Your real-time gap analysis and iGOT course trajectory have been dynamically updated!
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/learning-path')}>
              <TrendingUp size={16} /> View Updated Learning Path
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              <BarChart2 size={16} /> Return to Dashboard
            </button>
          </div>
        </div>

        {/* Question Review Section */}
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="#6366f1" /> In-Depth Answer Review & Source Citations
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((quest, idx) => {
            const userAns = selectedAnswers[quest.id];
            const isCorrect = userAns === quest.correct_answer;

            return (
              <div
                key={quest.id || idx}
                className="card"
                style={{
                  borderLeft: isCorrect ? '4px solid #10b981' : '4px solid #ef4444',
                  background: 'rgba(15,23,42,0.6)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCorrect ? '#34d399' : '#f87171' }}>
                    {isCorrect ? '✅ QUESTION ' + (idx + 1) + ' (CORRECT)' : '❌ QUESTION ' + (idx + 1) + ' (INCORRECT)'}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                    {quest.topic || 'Statistical Skill'}
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc', marginBottom: '12px' }}>
                  {quest.question}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  {Object.entries(quest.options || {}).map(([k, v]) => {
                    const isKeyCorrect = k === quest.correct_answer;
                    const isKeySelected = k === userAns;

                    let bg = 'rgba(255,255,255,0.03)';
                    let border = 'rgba(255,255,255,0.06)';
                    let textCol = '#cbd5e1';

                    if (isKeyCorrect) {
                      bg = 'rgba(16,185,129,0.15)';
                      border = '#10b981';
                      textCol = '#34d399';
                    } else if (isKeySelected && !isKeyCorrect) {
                      bg = 'rgba(239,68,68,0.15)';
                      border = '#ef4444';
                      textCol = '#f87171';
                    }

                    return (
                      <div
                        key={k}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: bg,
                          border: `1px solid ${border}`,
                          color: textCol,
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <strong>{k}.</strong> {v}
                        {isKeyCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓ Correct</span>}
                        {isKeySelected && !isKeyCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✗ Your Choice</span>}
                      </div>
                    );
                  })}
                </div>

                {quest.explanation && (
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      color: '#94a3b8',
                      borderLeft: '2px solid #6366f1',
                    }}
                  >
                    💡 <strong>Official Source Explanation:</strong> {quest.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="animate-fadeInUp" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
              <ShieldCheck size={12} /> MoSPI & iGOT Competency Assessment
            </span>
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{quiz.title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <Clock size={16} color="#06b6d4" /> {formatTime(secondsElapsed)}
            </div>
            <button className="btn btn-success btn-sm" onClick={handleSubmitQuiz} disabled={submitting}>
              Submit Assessment
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '14px', width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${((currentIdx + 1) / Math.max(1, questions.length)) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8' }}>
            QUESTION {currentIdx + 1} OF {questions.length}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              {q?.topic || 'Official Statistics'}
            </span>
            <button
              className={`btn btn-xs ${flagged[q?.id] ? 'btn-danger' : 'btn-ghost'}`}
              onClick={toggleFlag}
              title="Flag for review"
            >
              {flagged[q?.id] ? '🚩 Flagged' : '🏳️ Flag'}
            </button>
          </div>
        </div>

        <h3 style={{ fontSize: '1.05rem', lineHeight: '1.5', color: '#f8fafc', marginBottom: '20px' }}>
          {q?.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.entries(q?.options || {}).map(([key, val]) => {
            const isSelected = selectedAnswers[q.id] === key;
            return (
              <div
                key={key}
                onClick={() => handleSelect(key)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.08)',
                    color: '#fff',
                  }}
                >
                  {key}
                </div>
                <div style={{ fontSize: '0.88rem', flex: 1 }}>{val}</div>
                {isSelected && <Check size={18} color="#818cf8" />}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            className="btn btn-ghost"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {isLast ? (
            <button className="btn btn-primary" onClick={handleSubmitQuiz} disabled={submitting}>
              Submit Assessment & Upgrade Competency
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}>
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Question Number Pills */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
          QUESTION NAVIGATOR
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {questions.map((quest, idx) => {
            const isAns = !!selectedAnswers[quest.id];
            const isCurrent = idx === currentIdx;
            const isFlag = !!flagged[quest.id];

            let bg = 'rgba(255,255,255,0.04)';
            let border = '1px solid rgba(255,255,255,0.08)';
            let color = '#94a3b8';

            if (isCurrent) {
              border = '2px solid #6366f1';
              color = '#fff';
            }
            if (isAns) {
              bg = 'rgba(16,185,129,0.2)';
              border = '1px solid #10b981';
              color = '#34d399';
            }
            if (isFlag) {
              border = '1px solid #ef4444';
            }

            return (
              <button
                key={quest.id || idx}
                onClick={() => setCurrentIdx(idx)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: bg,
                  border,
                  color,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
