import { useState, useEffect, useCallback } from 'react';
import * as svc from '../services/summaryService';

export function useSummaries() {
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const docs = await svc.listAllSummaries();
        const map = {};
        docs.forEach(doc => { map[doc.month] = doc.text; });
        setSummaries(map);
      } catch (err) {
        console.error('Failed to load summaries:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSummary = useCallback(async (month, text) => {
    await svc.upsertSummary(month, text);
    setSummaries(prev => ({ ...prev, [month]: text }));
  }, []);

  return { summaries, loading, saveSummary };
}
