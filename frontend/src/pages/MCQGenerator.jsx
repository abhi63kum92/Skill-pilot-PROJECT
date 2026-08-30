import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileText, Presentation, Film, Brain,
  CheckCircle2, XCircle, RefreshCw, Download,
  ChevronRight, Sparkles, AlertCircle, Loader2,
  BookOpen, Settings, Play, Trash2, Eye, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateMcqs } from '../services/api';

const SAMPLE_MATERIAL_CONTENT = `# Introduction to Official Statistics & Survey Design

Official statistics are statistics published by government agencies or other public bodies such as international organizations as a public good. They provide quantitative or qualitative information on all major areas of citizens' lives, such as economic and social development, living conditions, health, education, and the environment.

## 1. Key Frameworks
The Sustainable Development Goals (SDGs) are a collection of 17 interlinked global goals designed to be a "blueprint to achieve a better and more sustainable future for all". The SDGs were set up in 2015 by the United Nations General Assembly and are intended to be achieved by the year 2030. In India, MoSPI is responsible for tracking SDG indicators.

## 2. Statistical Methods & Sampling
Sampling is a process used in statistical analysis in which a predetermined number of observations are taken from a larger population. 
- **Simple Random Sampling**: Every member of the population has an equal chance of being selected.
- **Stratified Sampling**: The population is divided into subgroups (strata) based on similar characteristics, and samples are taken from each stratum. This ensures representation from all groups.
- **Cluster Sampling**: The entire population is divided into clusters or sections, and random clusters are chosen for sampling.

## 3. Data Quality Dimensions
Coherence in data quality means that statistical outputs are consistent and comparable across different sources, time periods, and domains. Accuracy refers to the closeness of estimates to the exact or true values that the statistics were intended to measure. Timeliness reflects the time lag between data collection and release.

## 4. National Accounts & Price Statistics
National Accounts Statistics (NAS) provide a comprehensive macroeconomic framework. The Gross Domestic Product (GDP) is the most widely used measure of economic activity. The Consumer Price Index (CPI) measures changes in the price level of a weighted average market basket of consumer goods and services purchased by households.

## 5. Technology in Official Statistics
Modern statistical systems rely heavily on programming languages like Python and R. Python's Pandas library is extensively used for data manipulation and analysis, providing DataFrames for structured data operations. Data visualization is critical for disseminating statistical findings to policymakers.`;

export default function MCQGenerator() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [savedQuizzes, setSavedQuizzes] = useState(() => {
    const saved = localStorage.getItem('skillpilot_saved_quizzes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('generate');

  useEffect(() => {
    localStorage.setItem('skillpilot_saved_quizzes', JSON.stringify(savedQuizzes));
  }, [savedQuizzes]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setQuizData(null);
      toast.success(`File selected: ${acceptedFiles[0].name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
  });

  const loadSampleMaterial = () => {
    const file = new File([SAMPLE_MATERIAL_CONTENT], 'MoSPI_Official_Statistics_Guide.txt', {
      type: 'text/plain',
    });
    setUploadedFile(file);
    setQuizData(null);
    toast.success('Loaded MoSPI Official Statistics Sample Document!');
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a document or click "Use Sample MoSPI Document"');
      return;
    }

    setGenerating(true);
    setGenStep(1);
    const stepTimer1 = setTimeout(() => setGenStep(2), 700);
    const stepTimer2 = setTimeout(() => setGenStep(3), 1500);

    try {
      const result = await generateMcqs(uploadedFile, numQuestions, difficulty);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGenStep(4);

      setQuizData(result);
      toast.success(`✨ Generated ${result.questions.length} genuine MCQs directly from ${uploadedFile.name}!`);

      const newQuiz = {
        id: 'quiz-' + Date.now(),
        title: uploadedFile.name.replace(/\.[^/.]+$/, '') + ' Assessment',
        questionsCount: result.questions.length,
        difficulty,
        date: new Date().toISOString().split('T')[0],
        source: uploadedFile.name,
        questions: result.questions,
      };

      setSavedQuizzes((prev) => [newQuiz, ...prev.filter((q) => q.title !== newQuiz.title)]);
      localStorage.setItem('skillpilot_current_quiz', JSON.stringify(newQuiz));
    } catch (err) {
      toast.error('Generation failed: ' + (err.message || 'Error parsing document'));
    } finally {
      setGenerating(false);
      setGenStep(0);
    }
  };

  const handleTakeQuiz = (quizToTake) => {
    const target = quizToTake || {
      id: 'quiz-' + Date.now(),
      title: uploadedFile?.name ? uploadedFile.name.replace(/\.[^/.]+$/, '') + ' Assessment' : 'AI Generated Assessment',
      questionsCount: quizData.questions.length,
      difficulty,
      questions: quizData.questions,
    };
    localStorage.setItem('skillpilot_current_quiz', JSON.stringify(target));
    navigate(`/quiz/${target.id}`);
  };

  const exportQuizJSON = () => {
    if (!quizData) return;
    const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadedFile?.name || 'Quiz'}_MCQs.json`;
    a.click();
    toast.success('Downloaded Quiz JSON (iGOT QTI Compatible)');
  };

  const deleteSavedQuiz = (id) => {
    setSavedQuizzes((prev) => prev.filter((q) => q.id !== id));
    toast.success('Quiz deleted from history');
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">🧠 AI Quiz & MCQ Generator</h1>
            <p className="page-subtitle">
              Upload official learning materials (PDF, PPTX, Word, TXT) → AI dynamically generates validated assessments with MoSPI FRAC competency tags
            </p>
          </div>
          <button className="btn btn-outline" onClick={loadSampleMaterial} style={{ fontSize: '0.8rem' }}>
            <FileText size={14} /> Use Sample MoSPI Document
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '24px' }}>
        <button
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate MCQs
        </button>
        <button
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved & Diagnostic Quizzes ({savedQuizzes.length})
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left Column: Upload & Parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h3 style={{ marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} color="#6366f1" /> 1. Upload Training Document
              </h3>

              <div {...getRootProps()} className={`upload-zone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {uploadedFile ? (
                  <div>
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                      {uploadedFile.name.endsWith('.pdf') ? '📄' : uploadedFile.name.endsWith('.pptx') || uploadedFile.name.endsWith('.ppt') ? '📊' : '📝'}
                    </div>
                    <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>{uploadedFile.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {(uploadedFile.size / 1024).toFixed(1)} KB · Click or drag to replace
                    </div>
                    <span className="badge badge-success" style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Document Loaded & Ready
                    </span>
                  </div>
                ) : (
                  <div>
                    <Upload size={36} color="#6366f1" style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
                      Drop training materials here, or browse
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Supports PDF, PPT/PPTX, DOCX, TXT up to 25MB
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Config Card */}
            <div className="card">
              <h3 style={{ marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} color="#06b6d4" /> 2. Assessment Parameters
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Number of Questions
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[3, 5, 10, 15].map((num) => (
                      <button
                        key={num}
                        className={`btn ${numQuestions === num ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1, padding: '8px' }}
                        onClick={() => setNumQuestions(num)}
                      >
                        {num} MCQs
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Difficulty Level
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Beginner', 'Medium', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        className={`btn ${difficulty === lvl ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1, padding: '8px' }}
                        onClick={() => setDifficulty(lvl)}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '8px', padding: '12px' }}
                  onClick={handleGenerate}
                  disabled={generating || !uploadedFile}
                >
                  {generating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {genStep === 1 && 'Extracting Text & Concepts...'}
                      {genStep === 2 && 'Synthesizing Distractors...'}
                      {genStep === 3 && 'Validating MoSPI Competency Tags...'}
                      {genStep >= 4 && 'Finalizing Assessment...'}
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate AI Assessment Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Output / Live Generated Quiz */}
          <div>
            {quizData ? (
              <div className="card" style={{ border: '1px solid rgba(99,102,241,0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                      <ShieldCheck size={12} /> AI Generated · {quizData.questions.length} MCQs
                    </span>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                      {uploadedFile?.name || 'Generated Quiz'}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={exportQuizJSON} title="Download JSON">
                      <Download size={14} /> Export JSON
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => handleTakeQuiz(null)} style={{ background: '#10b981', color: '#fff' }}>
                      <Play size={14} /> Take Quiz Now
                    </button>
                  </div>
                </div>

                {/* Question List Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '580px', overflowY: 'auto', paddingRight: '4px' }}>
                  {quizData.questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      style={{
                        background: 'rgba(15,23,42,0.6)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        padding: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>
                          QUESTION {idx + 1}
                        </span>
                        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                          {q.topic || 'Statistical Skill'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px', color: '#f8fafc' }}>
                        {q.question}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                        {Object.entries(q.options).map(([optKey, optVal]) => {
                          const isCorrect = optKey === q.correct_answer;
                          return (
                            <div
                              key={optKey}
                              style={{
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                background: isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                                border: isCorrect ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.05)',
                                color: isCorrect ? '#34d399' : '#cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <strong style={{ opacity: 0.8 }}>{optKey}.</strong> {optVal}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', borderLeft: '2px solid #6366f1' }}>
                          💡 <strong>Source citation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => handleTakeQuiz(null)} style={{ width: '100%', padding: '12px' }}>
                    <Play size={16} /> Launch Interactive Quiz & Update Competency Profile
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="card"
                style={{
                  minHeight: '380px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: '1px dashed rgba(255,255,255,0.15)',
                }}
              >
                <Brain size={48} color="#6366f1" style={{ opacity: 0.4, marginBottom: '14px' }} />
                <h4 style={{ color: '#cbd5e1', marginBottom: '6px' }}>No Assessment Generated Yet</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '320px', margin: '0 auto 16px' }}>
                  Upload a PDF, survey manual, or MoSPI document on the left and click "Generate AI Assessment".
                </p>
                <button className="btn btn-outline btn-sm" onClick={loadSampleMaterial}>
                  Load Sample Document to Test Instantly
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          {savedQuizzes.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <BookOpen size={40} color="#6366f1" style={{ opacity: 0.5, margin: '0 auto 12px' }} />
              <h3>No Saved Quizzes Found</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Generate your first quiz from the "Generate MCQs" tab to take assessments.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {savedQuizzes.map((q) => (
                <div key={q.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className="badge badge-info">{q.difficulty || 'Medium'}</span>
                      <button className="btn btn-ghost btn-xs" onClick={() => deleteSavedQuiz(q.id)} title="Delete">
                        <Trash2 size={13} color="#ef4444" />
                      </button>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>{q.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                      Source: {q.source || 'Uploaded Document'} · {q.questionsCount || q.questions?.length || 5} Questions
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleTakeQuiz(q)}
                    >
                      <Play size={14} /> Take Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
