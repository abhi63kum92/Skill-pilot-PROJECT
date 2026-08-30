import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    appName: 'SkillPilot',
    appSubtitle: 'AI LEARNING PLATFORM',
    govtOrg: 'Ministry of Statistics & Programme Implementation',
    igotIntegration: 'iGOT Karmayogi Ecosystem',
    liveSystem: 'Live System',
    nav: {
      dashboard: 'Dashboard',
      profile: 'My Profile',
      learningPath: 'Learning Path',
      courses: 'Course Catalog',
      quizGen: 'Quiz Generator',
      virtualLab: 'Virtual Lab (AI/Code)',
      certificates: 'Certifications',
      admin: 'Admin Dashboard',
    },
    dashboard: {
      greeting: 'Good day',
      streak: '7-day streak',
      alertTitle: 'AI detected 3 critical skill gaps for your role',
      alertSub: 'Python, ML & Cloud Computing — 5 iGOT courses recommended',
      viewPath: 'View Path',
      overallScore: 'Overall Score',
      coursesEnrolled: 'Courses Enrolled',
      quizzesTaken: 'Quizzes Taken',
      learningHours: 'Learning Hours',
      radarTitle: 'Competency Radar',
      radarSub: 'AI-assessed across 6 domains',
      progressTitle: 'Learning Progress',
      progressSub: 'Competency score over time',
      skillGapsTitle: 'Top Skill Gaps',
      activeCoursesTitle: 'Active Courses',
      generateQuizBtn: 'Generate Quiz from Material',
    },
    profile: {
      title: 'Competency Profile',
      subtitle: 'AI-powered competency mapping across all domains',
      saveBtn: 'Save & Recalculate',
      syncIgot: 'Sync with iGOT ID',
    }
  },
  hi: {
    appName: 'कौशल सेतु',
    appSubtitle: 'एआई शिक्षण मंच',
    govtOrg: 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)',
    igotIntegration: 'आईगॉट कर्मयोगी एकीकरण',
    liveSystem: 'सक्रिय प्रणाली',
    nav: {
      dashboard: 'डैशबोर्ड',
      profile: 'मेरी प्रोफ़ाइल',
      learningPath: 'अध्ययन पथ',
      courses: 'पाठ्यक्रम सूची',
      quizGen: 'क्विज़ जेनरेटर',
      virtualLab: 'वर्चुअल लैब (कोड/डेटा)',
      certificates: 'प्रमाणपत्र',
      admin: 'प्रशासन डैशबोर्ड',
    },
    dashboard: {
      greeting: 'नमस्ते',
      streak: '7-दिवसीय निरंतरता',
      alertTitle: 'एआई ने आपकी भूमिका के लिए 3 मुख्य कौशल अंतर पाए हैं',
      alertSub: 'पायथन, एमएल और क्लाउड कंप्यूटिंग — 5 आईगॉट पाठ्यक्रम अनुशंसित',
      viewPath: 'पथ देखें',
      overallScore: 'कुल दक्षता स्कोर',
      coursesEnrolled: 'नामांकित पाठ्यक्रम',
      quizzesTaken: 'हल किए गए क्विज़',
      learningHours: 'अध्ययन के घंटे',
      radarTitle: 'दक्षता रडार',
      radarSub: '6 क्षेत्रों में एआई द्वारा मूल्यांकित',
      progressTitle: 'सीखने की प्रगति',
      progressSub: 'समय के साथ दक्षता स्कोर',
      skillGapsTitle: 'मुख्य कौशल अंतर (Skill Gaps)',
      activeCoursesTitle: 'सक्रिय पाठ्यक्रम',
      generateQuizBtn: 'सामग्री से क्विज़ बनाएं',
    },
    profile: {
      title: 'दक्षता प्रोफ़ाइल',
      subtitle: 'सभी क्षेत्रों में एआई-संचालित दक्षता मानचित्रण',
      saveBtn: 'सहेजें और पुनः गणना करें',
      syncIgot: 'iGOT कर्मयोगी से सिंक करें',
    }
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('skillpilot_lang') || localStorage.getItem('skillsetu_lang') || 'en';
  });

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('skillpilot_lang', nextLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
