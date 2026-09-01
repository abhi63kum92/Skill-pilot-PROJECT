import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Send, Bot, User, Sparkles, Volume2,
  VolumeX, Mic, MicOff, Globe, Radio, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../services/api';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

const SYSTEM_CONTEXT = `You are SkillPilot AI Voice & Knowledge Assistant for India's Ministry of Statistics & Programme Implementation (MoSPI) and iGOT Karmayogi Bharat.
You assist statistical officers, field investigators, students, data analysts, and citizens across India.
- You can answer ANY question the user asks: Official Statistics, Survey Sampling (PLFS, ASI, NSSO), CPI/WPI Inflation, National Accounts (GDP/SNA 2008), SDG Indicators, Data Science & Coding (Python, Pandas, NumPy, SQL, R, ML), Mathematics, General Knowledge, Government Acts (DPDP Act 2023), Career advice, or general conversation.
- Answer in the same language the user uses (Hindi, Hinglish, or English) with high fluency and friendly professionalism.
- Keep answers structured, crisp, informative, and engaging. Use bullet points and code formatting where helpful.`;

const QUICK_QUESTIONS_EN = [
  '📊 What courses should I take for Python?',
  '🎯 How does skill gap analysis work?',
  '📋 Explain SDG indicators & MoSPI role',
  '🤖 How is MCQ generated from PDF?',
];

const QUICK_QUESTIONS_HI = [
  '📊 सांख्यिकी और Python के लिए कौन से कोर्स हैं?',
  '🎯 स्किल गैप का विश्लेषण कैसे होता है?',
  '📋 MoSPI में SDG इंडिकेटर क्या हैं?',
  '🤖 PDF से क्विज़ कैसे बनाएं?',
];

async function askSkillPilotAI(messages, lang = 'en') {
  const lastMsg = messages[messages.length - 1]?.content || '';

  // 1. Try Backend Chat API (MoSPI Knowledge Engine + Groq / Gemini)
  try {
    const formatted = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }));

    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formatted,
        userRole: 'Statistical Officer',
        userDepartment: 'MoSPI'
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.response) return data.response;
    }
  } catch (e) {
    console.warn('Backend chat route unavailable, using direct Groq/fallback engine:', e.message);
  }

  // 2. Try direct Groq Cloud API (Super Fast & Covers Any Question)
  if (GROQ_API_KEY) {
    try {
      const groqMessages = [
        { role: 'system', content: SYSTEM_CONTEXT },
        ...messages.slice(-6).map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      ];

      const groqModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'qwen/qwen3.6-27b', 'allam-2-7b'];
      for (const model of groqModels) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model,
              messages: groqMessages,
              temperature: 0.6,
              max_tokens: 800
            })
          });

          if (res.ok) {
            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply && reply.trim()) return reply.trim();
          }
        } catch {
          // try next groq model
        }
      }
    } catch (e) {
      console.warn('Groq direct API error:', e.message);
    }
  }

  // 3. Try direct Gemini API if key is present
  if (GEMINI_API_KEY) {
    try {
      const contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
      for (const model of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_CONTEXT }] },
                contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
              })
            }
          );
          if (res.ok) {
            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return reply.trim();
          }
        } catch {
          // try next model
        }
      }
    } catch (e) {
      console.warn('Gemini error:', e.message);
    }
  }

  return getFallbackResponse(lastMsg, lang);
}

function getFallbackResponse(query, lang = 'en') {
  const q = query.toLowerCase();
  const isHi = lang === 'hi' || q.includes('हिंदी') || q.includes('सांख्यिकी') || q.includes('कोर्स');

  if (q.includes('frac') || q.includes('framework')) {
    return isHi
      ? "🏛️ **FRAC फ्रेमवर्क (क्षमता निर्माण आयोग):**\nमिशन कर्मयोगी के तहत FRAC भूमिकाओं, गतिविधियों और दक्षताओं को मैप करता है ताकि हर अधिकारी को उनके पद के अनुसार लक्षित प्रशिक्षण मिल सके।"
      : "🏛️ **FRAC Framework (Framework for Roles, Activities & Competencies):**\nDeveloped under Mission Karmayogi by the Capacity Building Commission (CBC). It breaks down government roles into specific competencies for targeted official training.";
  }
  if (q.includes('python') || q.includes('पायथन') || q.includes('course') || q.includes('कोर्स')) {
    return isHi
      ? "🐍 **आधिकारिक सांख्यिकी के लिए Python:**\nहम iGOT कर्मयोगी पर **'Python for Statistical Data Processing & Analysis'** (30 घंटे) की अनुशंसा करते हैं। इसमें Pandas, NumPy और डेटा विज़ुअलाइज़ेशन शामिल है।"
      : "🐍 **Python for Official Statistics:**\nWe recommend **'Python for Statistical Data Processing & Analysis'** on iGOT Karmayogi (30 Hours). It covers Pandas microdata cleaning, NumPy calculations, and automated report generation.";
  }
  if (q.includes('skill gap') || q.includes('competency') || q.includes('gap') || q.includes('गैप')) {
    return isHi
      ? "🎯 **AI स्किल गैप विश्लेषण:**\nSkillPilot आपके वर्तमान मूल्यांकन की तुलना MoSPI के 4 डोमेन (सांख्यिकी, तकनीकी, डिजिटल गवर्नेंस, व्यवहारिक) के बेंचमार्क से करके वैयक्तिकृत iGOT कोर्स सुझाता है।"
      : "🎯 **AI Skill Gap Analysis:**\nSkillPilot compares your competency levels across 4 domains (Statistical, Technical, Digital Governance, Behavioural) against MoSPI role benchmarks to generate personalized iGOT trajectories.";
  }
  if (q.includes('mcq') || q.includes('quiz') || q.includes('pdf') || q.includes('क्विज़')) {
    return isHi
      ? "🧠 **दस्तावेज़ से AI क्विज़:**\n'Quiz Generator' पेज पर कोई भी PDF या प्रशिक्षण सामग्री अपलोड करें। AI स्वचालित रूप से व्याख्या सहित बहुविकल्पीय प्रश्न (MCQ) तैयार करता है।"
      : "🧠 **AI Quiz Generation from Documents:**\nUpload survey manuals, training notes, or policy PDFs to the **Quiz Generator**. The AI extracts key methodologies and constructs verified MCQs with explanations.";
  }
  if (q.includes('sdg') || q.includes('sustainable')) {
    return isHi
      ? "🌍 **SDG राष्ट्रीय संकेतक ढांचा (NIF):**\nMoSPI भारत में 17 सतत विकास लक्ष्यों (SDGs) के 115+ संकेतकों की निगरानी के लिए नोडल मंत्रालय है। हमारे कोर्स कैटलॉग में SDG कोर्स देखें!"
      : "🌍 **SDG National Indicator Framework (NIF):**\nMoSPI is the nodal ministry monitoring 115+ indicators across 17 SDGs in India. Check out the **'SDG Indicators & Data Stewardship'** course in our Catalog!";
  }
  if (q.includes('sampling') || q.includes('survey') || q.includes('सर्वे')) {
    return isHi
      ? "📊 **सर्वेक्षण डिज़ाइन और सैंपलिंग:**\nNSSO दौरों (PLFS, ASI) में स्तरीकृत बहु-चरणीय नमूनाकरण (Stratified Multi-Stage Sampling) और डिज़ाइन प्रभाव (Deff) का उपयोग होता है।"
      : "📊 **Survey Design & Sampling Methods:**\nCovers Stratified Multi-Stage Sampling used in NSSO rounds (PLFS, ASI). Key concepts include sampling frame stratification, PPS selection, and design effect (Deff) estimation.";
  }
  if (q.includes('dpdp') || q.includes('privacy') || q.includes('cyber')) {
    return isHi
      ? "🔒 **DPDP अधिनियम 2023:**\nनागरिकों के व्यक्तिगत डेटा सुरक्षा और डेटा फिड्यूशरी के वैधानिक दायित्वों को निर्धारित करता है। iGOT पर इसका विशेष कोर्स उपलब्ध है।"
      : "🔒 **DPDP Act 2023 Compliance:**\nMandates strict purpose limitation, citizen consent management, and data fiduciary responsibilities for official data collectors.";
  }
  return isHi
    ? "👋 नमस्ते! मैं आपका **SkillPilot MoSPI वॉयस असिस्टेंट** हूँ। आप माइक दबाकर या लिखकर iGOT कोर्स, स्किल गैप, सैंपलिंग या आधिकारिक सांख्यिकी के बारे में पूछ सकते हैं।"
    : "👋 Namaste! I am your **SkillPilot MoSPI Voice Assistant**. You can speak via mic or type to explore iGOT courses, competency gaps, sampling methods, or official statistics standards.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [chatLang, setChatLang] = useState('en'); // 'en' | 'hi'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! 🙏 I'm your **SkillPilot AI Voice Assistant**. Tap the mic 🎙️ to speak or ask any question about MoSPI competencies, iGOT courses, or statistical standards.",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState(null);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = chatLang === 'hi' ? 'hi-IN' : 'en-IN';

      recog.onstart = () => {
        setIsListening(true);
      };

      recog.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      recog.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow mic permissions.');
        }
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }
  }, [chatLang]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = chatLang === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        toast('🎙️ Listening... Speak now', { icon: '🎤', duration: 3000 });
      } catch (err) {
        console.warn('Mic start failed:', err);
      }
    }
  };

  const handleSpeak = (text, idx) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported in this browser.');
      return;
    }

    if (speakingMsgIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.lang = chatLang === 'hi' ? 'hi-IN' : 'en-IN';

    // Try finding Indian English or Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v =>
      (chatLang === 'hi' && (v.lang.includes('hi') || v.name.includes('Hindi'))) ||
      (chatLang === 'en' && (v.lang.includes('en-IN') || v.name.includes('India')))
    );
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onend = () => setSpeakingMsgIdx(null);
    utterance.onerror = () => setSpeakingMsgIdx(null);

    setSpeakingMsgIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const newMessages = [...messages, { role: 'user', content: msg, time: new Date() }];
    setMessages(newMessages);
    setLoading(true);

    const reply = await askSkillPilotAI(newMessages.filter(m => m.role !== 'system'), chatLang);
    const newIdx = newMessages.length;
    setMessages(prev => [...prev, { role: 'assistant', content: reply, time: new Date() }]);
    setLoading(false);

    // Auto-speak reply if user used voice
    if (isListening || text) {
      setTimeout(() => handleSpeak(reply, newIdx), 200);
    }
  };

  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Render markdown bold, bullet points, inline code, and headers
  const renderContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    const renderInline = (str) => {
      const tokens = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return tokens.map((tok, idx) => {
        if (tok.startsWith('**') && tok.endsWith('**')) {
          return <strong key={idx} style={{ color: '#f8fafc', fontWeight: 700 }}>{tok.slice(2, -2)}</strong>;
        }
        if (tok.startsWith('`') && tok.endsWith('`')) {
          return <code key={idx} style={{ background: 'rgba(99,102,241,0.22)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px', fontSize: '0.78rem', fontFamily: 'monospace' }}>{tok.slice(1, -1)}</code>;
        }
        return tok;
      });
    };

    return lines.map((line, lineIdx) => {
      if (line.startsWith('```')) return null;

      if (line.startsWith('### ')) {
        return <div key={lineIdx} style={{ fontWeight: 700, fontSize: '0.88rem', color: '#38bdf8', marginTop: '6px', marginBottom: '2px' }}>{renderInline(line.replace(/^###\s+/, ''))}</div>;
      }
      if (line.startsWith('## ')) {
        return <div key={lineIdx} style={{ fontWeight: 800, fontSize: '0.92rem', color: '#a5b4fc', marginTop: '7px', marginBottom: '3px' }}>{renderInline(line.replace(/^##\s+/, ''))}</div>;
      }
      if (line.startsWith('# ')) {
        return <div key={lineIdx} style={{ fontWeight: 800, fontSize: '0.96rem', color: '#818cf8', marginTop: '8px', marginBottom: '4px' }}>{renderInline(line.replace(/^#\s+/, ''))}</div>;
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <div key={lineIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', margin: '2px 0 2px 4px' }}>
            <span style={{ color: '#6366f1', fontSize: '0.85rem' }}>•</span>
            <span style={{ flex: 1 }}>{renderInline(line.trim().replace(/^[-*]\s+/, ''))}</span>
          </div>
        );
      }

      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        return (
          <div key={lineIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', margin: '2px 0 2px 4px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.78rem', minWidth: '16px' }}>{numMatch[1]}.</span>
            <span style={{ flex: 1 }}>{renderInline(numMatch[2])}</span>
          </div>
        );
      }

      if (line.trim() === '---' || line.trim() === '***') {
        return <hr key={lineIdx} style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />;
      }

      if (!line.trim()) {
        return <div key={lineIdx} style={{ height: '4px' }} />;
      }

      return <div key={lineIdx} style={{ margin: '1px 0' }}>{renderInline(line)}</div>;
    });
  };

  const quickQuestions = chatLang === 'hi' ? QUICK_QUESTIONS_HI : QUICK_QUESTIONS_EN;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000,
          width: '58px', height: '58px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.55)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: open ? 'scale(0.9)' : 'scale(1)',
        }}
        title="SkillPilot AI Voice Assistant"
      >
        {open ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
        {!open && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '14px', height: '14px', background: '#10b981',
            borderRadius: '50%', border: '2px solid #0a0a0f',
            animation: 'pulse 2s infinite'
          }} />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px', zIndex: 999,
          width: '380px', maxWidth: 'calc(100vw - 32px)', height: '540px', maxHeight: 'calc(100vh - 120px)',
          background: '#111118', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '24px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.15)',
          animation: 'fadeInUp 0.3s ease',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(6,182,212,0.1))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: '38px', height: '38px', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
            }}>
              <Bot size={19} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', fontFamily: 'Space Grotesk, sans-serif', color: '#f8fafc' }}>
                SkillPilot Voice AI
              </div>
              <div style={{ fontSize: '0.66rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
                MoSPI Knowledge Engine · Bhashini Ready
              </div>
            </div>

            {/* Language Toggle */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => {
                  const next = chatLang === 'en' ? 'hi' : 'en';
                  setChatLang(next);
                  toast.success(`Voice & Chat switched to ${next === 'hi' ? 'हिन्दी (Hindi)' : 'English'}`);
                }}
                style={{
                  padding: '4px 8px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 700,
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  color: '#c7d2fe', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                }}
                title="Switch Language"
              >
                <Globe size={11} /> {chatLang === 'en' ? 'EN' : 'हिन्दी'}
              </button>
            </div>
          </div>

          {/* Listening Banner */}
          {isListening && (
            <div style={{
              background: 'linear-gradient(90deg, rgba(239,68,68,0.2), rgba(99,102,241,0.2))',
              borderBottom: '1px solid rgba(239,68,68,0.3)', padding: '6px 14px',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#fca5a5',
              animation: 'pulse 1.5s infinite'
            }}>
              <Radio size={13} className="animate-spin" color="#ef4444" />
              <span>{chatLang === 'hi' ? 'माइक सक्रिय है... कृपया बोलें' : 'Listening... Speak your question now'}</span>
              <button
                onClick={toggleMic}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontWeight: 700 }}
              >
                Done
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                <div style={{
                  width: '28px', height: '28px', flexShrink: 0,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: msg.role === 'user' ? 'rgba(99,102,241,0.25)' : 'linear-gradient(135deg, #6366f1, #06b6d4)',
                }}>
                  {msg.role === 'user' ? <User size={14} color="#818cf8" /> : <Bot size={14} color="white" />}
                </div>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{
                    padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user' ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)'}`,
                    fontSize: '0.82rem', lineHeight: 1.6, color: '#e2e8f0', position: 'relative'
                  }}>
                    {renderContent(msg.content)}

                    {/* Text-to-Speech Button */}
                    {msg.role !== 'user' && (
                      <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.content, i)}
                          style={{
                            background: speakingMsgIdx === i ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px',
                            cursor: 'pointer', color: speakingMsgIdx === i ? '#34d399' : '#818cf8',
                            padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 600
                          }}
                          title="Read out loud"
                        >
                          {speakingMsgIdx === i ? <><VolumeX size={12} color="#ef4444" /> Stop Audio</> : <><Volume2 size={12} /> Suniye (Listen) 🔊</>}
                        </button>
                      </div>
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
                <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px 16px 16px 16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '6px' }}>Consulting MoSPI Engine...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions Chips */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {quickQuestions.map(q => (
                <button key={q} onClick={() => send(q)}
                  style={{
                    padding: '5px 10px', borderRadius: '999px', fontSize: '0.7rem',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)',
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

          {/* Input & Voice Controls */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={toggleMic}
              style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: isListening ? '#ef4444' : 'rgba(99,102,241,0.15)',
                border: isListening ? '1px solid #f87171' : '1px solid rgba(99,102,241,0.3)',
                color: isListening ? 'white' : '#818cf8',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
                boxShadow: isListening ? '0 0 16px rgba(239,68,68,0.6)' : 'none'
              }}
              title={isListening ? 'Stop Listening' : 'Speak via Voice (Bhashini)'}
            >
              {isListening ? <MicOff size={17} /> : <Mic size={17} />}
            </button>

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={chatLang === 'hi' ? 'सवाल पूछें या माइक दबाकर बोलें...' : 'Ask question or tap mic to speak...'}
              style={{
                flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
                border: isListening ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', color: '#f1f5f9', fontSize: '0.82rem', outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; }}
              onBlur={e => { e.target.style.borderColor = isListening ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'; }}
            />

            <button
              type="button"
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
