import { useState, useEffect, useCallback } from 'react';
import { months } from '../constants/categories';
import * as svc from '../services/expenseService';

export function useExpenses() {
  const [expenses, setExpenses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const docs = await svc.listAllExpenses();
        const grouped = {};
        months.forEach(m => { grouped[m] = []; });
        docs.forEach(doc => {
          if (!grouped[doc.month]) grouped[doc.month] = [];
          grouped[doc.month].push(doc);
        });
        // Sort each month by date
        months.forEach(m => {
          grouped[m].sort((a, b) => a.date - b.date);
        });
        setExpenses(grouped);
      } catch (err) {
        console.error('Failed to load expenses:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addExpense = useCallback(async (data) => {
    const doc = await svc.createExpense(data);
    setExpenses(prev => {
      const month = data.month;
      const updated = [...(prev[month] || []), doc].sort((a, b) => a.date - b.date);
      return { ...prev, [month]: updated };
    });
    return doc;
  }, []);

  const updateExpense = useCallback(async (id, month, data) => {
    const doc = await svc.updateExpense(id, data);
    setExpenses(prev => {
      const updated = (prev[month] || []).map(e => e.$id === id ? { ...e, ...doc } : e);
      return { ...prev, [month]: updated };
    });
    return doc;
  }, []);

  const removeExpense = useCallback(async (id, month) => {
    await svc.deleteExpense(id);
    setExpenses(prev => {
      const updated = (prev[month] || []).filter(e => e.$id !== id);
      return { ...prev, [month]: updated };
    });
  }, []);

  return { expenses, loading, addExpense, updateExpense, removeExpense };
}
