import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getMyAssessment } from '../services/api';

const IntelligenceContext = createContext(null);

export function IntelligenceProvider({ children }) {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  // ── Fetch assessment from DB whenever user changes ────────────
  const fetchAssessment = useCallback(async () => {
    if (!user) {
      setAssessment(null);
      return;
    }
    setAssessmentLoading(true);
    try {
      const data = await getMyAssessment();
      setAssessment(data);
    } catch {
      // 404 = no assessment yet (new user who hasn't submitted profile)
      setAssessment(null);
    } finally {
      setAssessmentLoading(false);
    }
  }, [user?.id]); // re-run only when the logged-in user changes

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  // Called after Save & Recalculate in CompetencyProfile
  const updateAssessment = useCallback((nextAssessment) => {
    setAssessment(nextAssessment);
  }, []);

  // Refresh from DB (e.g., after a quiz level-up)
  const refreshAssessment = useCallback(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  const value = useMemo(
    () => ({ assessment, assessmentLoading, updateAssessment, refreshAssessment }),
    [assessment, assessmentLoading, updateAssessment, refreshAssessment]
  );

  return (
    <IntelligenceContext.Provider value={value}>
      {children}
    </IntelligenceContext.Provider>
  );
}

export const useIntelligence = () => useContext(IntelligenceContext);
