import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Brain, Volume2, VolumeX } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

const SYSTEM_CONTEXT = `You are SkillPilot AI Assistant, an intelligent virtual guide for India's Official Statistical System (MoSPI) learning platform called SkillPilot. You help government officials:
- Find relevant courses on iGOT Karmayogi and NSSTA TPAC
- Understand their skill gaps in Statistical, Technical, Digital Governance and Behavioural domains
- Navigate their personalized learning paths
- Understand concepts in statistics, data science, Python, R, SQL, GIS, SDG indicators, national accounts, price statistics, etc.
- Answer questions about the platform features

Be concise, helpful, and always relate answers to the context of India's statistical workforce. When recommending courses, mention iGOT Karmayogi or NSSTA TPAC. Use simple language mixed with professional tone. Keep responses under 120 words unless the user asks for details. Use emojis sparingly to be friendly.`;

const QUICK_QUESTIONS = [
  '📊 What courses should I take for Python?',
  '🎯 How does skill gap analysis work?',
  '📋 Explain SDG indicators',
  '🤖 How is MCQ generated from PDF?',
];

async function askGemini(messages) {
  // Try Groq first (easier key, faster responses)
  if (GROQ_API_KEY) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_CONTEXT },
            ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
          ],
          max_tokens: 500, temperature: 0.75
        })
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      }
    } catch (e) { console.warn('Groq failed:', e.message); }
  }

  // Try Gemini if key is provided
  if (GEMINI_API_KEY) {
    try {
      const contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];
      for (const model of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
                contents,
                generationConfig: { temperature: 0.75, maxOutputTokens: 600 }
              })
            }
          );
          if (res.ok) {
            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return reply;
          }
        } catch (e) {
          console.warn(`Model ${model} failed:`, e.message);
        }
      }
    } catch (e) {
      console.warn('Gemini error:', e.message);
    }
  }

  return getFallbackResponse(messages[messages.length - 1].content);
}

function getFallbackResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('python') || q.includes('course')) {
    return "🐍 For Python, I recommend **'Python for Data Analysis'** on iGOT Karmayogi (20hrs, Beginner). It covers Pandas, NumPy, and data visualization — perfect for statistical officers. You can find it in the Course Catalog with a 95% match to your profile!";
  }
  if (q.includes('skill gap') || q.includes('competency')) {
    return "🎯 SkillPilot uses AI to compare your current competency levels (from your profile) against the MoSPI competency framework across 4 domains: Statistical, Technical, Digital Governance & Behavioural. The gaps are then used to generate personalized iGOT course recommendations!";
  }
  if (q.includes('mcq') || q.includes('quiz') || q.includes('pdf')) {
    return "🧠 Upload any PDF, PPT, or DOCX to the **Quiz Generator** page! Google Gemini 1.5 Flash reads the content, identifies key concepts, and generates Multiple Choice Questions with explanations. You can pick 3-15 questions at Easy/Medium/Hard level!";
  }
  if (q.includes('sdg') || q.includes('sustainable')) {
    return "🌍 SDG stands for Sustainable Development Goals — 17 goals set by the UN in 2015 for 2030. India's MoSPI is the nodal agency for tracking 115+ SDG indicators. NSSTA offers an excellent **'SDG Indicator Framework'** course. Check the Course Catalog!";
  }
  if (q.includes('igot') || q.includes('karmayogi')) {
    return "📚 iGOT Karmayogi is India's national learning platform for government officials with 1000+ courses. SkillPilot integrates with it to recommend the most relevant courses for your role, experience, and skill gaps automatically!";
  }
  if (q.includes('dashboard') || q.includes('analytics')) {
    return "📊 Your **Learner Dashboard** shows competency radar chart, learning progress over time, top skill gaps, and active courses. The **Admin Dashboard** (login as admin@mospi.gov.in) shows org-wide analytics, department performance, and AI predictions!";
  }
  return "👋 I'm SkillPilot AI, your learning companion for MoSPI officials! I can help you find courses on iGOT Karmayogi, understand your skill gaps, or navigate your learning path. Try asking: 'What Python courses are available?' or 'Explain how skill gap analysis works'.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! 🙏 I'm your **SkillPilot AI Assistant**. I can help you find iGOT courses, understand skill gaps, or answer questions about official statistics. How can I help you today?",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: msg, time: new Date() }];
    setMessages(newMessages);
    setLoading(true);

    const reply = await askGemini(newMessages.filter(m => m.role !== 'system'));
    setMessages(prev => [...prev, { role: 'assistant', content: reply, time: new Date() }]);
    setLoading(false);
  };

  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Render simple markdown bold **text**
  const renderContent = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} style={{ color: '#f1f5f9' }}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: open ? 'scale(0.9)' : 'scale(1)',
        }}
        title="AI Assistant"
      >
        {open ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
        {!open && (
          <span style={{
            position: 'absolute', top: '4px', right: '4px',
            width: '12px', height: '12px', background: '#10b981',
            borderRadius: '50%', border: '2px solid #0a0a0f',
            animation: 'pulse 2s infinite'
          }} />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '28px', zIndex: 999,
          width: '360px', height: '520px',
          background: '#111118', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          animation: 'fadeInUp 0.3s ease',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.08))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: '38px', height: '38px', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bot size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                SkillPilot AI
              </div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
                Online · Powered by Gemini
              </div>
            </div>
            <Sparkles size={14} color="#818cf8" style={{ marginLeft: 'auto' }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                <div style={{
                  width: '28px', height: '28px', flexShrink: 0,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: msg.role === 'user' ? 'rgba(99,102,241,0.2)' : 'linear-gradient(135deg, #6366f1, #06b6d4)',
                }}>
                  {msg.role === 'user' ? <User size={14} color="#818cf8" /> : <Bot size={14} color="white" />}
                </div>
                <div style={{ maxWidth: '76%' }}>
                  <div style={{
                    padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    fontSize: '0.82rem', lineHeight: 1.6, color: '#d1d5db', position: 'relative'
                  }}>
                    {renderContent(msg.content)}
                    {msg.role !== 'user' && (
                      <button
                        type="button"
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const cleanText = msg.content.replace(/[*#_`]/g, '');
                            const utterance = new SpeechSynthesisUtterance(cleanText);
                            utterance.rate = 1.0;
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#818cf8', opacity: 0.7, padding: '2px 4px',
                          display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '0.65rem'
                        }}
                        title="Listen to response"
                      >
                        <Volume2 size={12} /> Listen
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '3px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="white" />
                </div>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px 16px 16px 16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q)}
                  style={{
                    padding: '5px 10px', borderRadius: '999px', fontSize: '0.7rem',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                    color: '#818cf8', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(99,102,241,0.1)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about courses, skills, statistics..."
              style={{
                flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                color: '#f1f5f9', fontSize: '0.82rem', outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: input.trim() ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.05)',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              <Send size={15} color={input.trim() ? 'white' : '#374151'} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
