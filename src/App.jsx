import { useState, useCallback } from 'react';
import './App.css';
import { Header } from './components/Header';
import { NavTabs } from './components/NavTabs';
import { ToastContainer } from './components/Toast';
import { ExpenseModal } from './components/ExpenseModal';
import { SummaryModal } from './components/SummaryModal';
import { Dashboard } from './views/Dashboard';
import { MonthView } from './views/MonthView';
import { AnimatedBackground } from './components/AnimatedBackground';
import { useExpenses } from './hooks/useExpenses';
import { useSummaries } from './hooks/useSummaries';
import { useToast } from './hooks/useToast';
function App() {
  const [view, setView] = useState('dashboard');
  const { expenses, loading, addExpense, updateExpense, removeExpense } = useExpenses();
  const { summaries, saveSummary } = useSummaries();
  const { toasts, showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [curMonth, setCurMonth] = useState(null);
  const [sumOpen, setSumOpen] = useState(false);
  const [sumMonth, setSumMonth] = useState(null);
  const openAdd = useCallback((m) => { setCurMonth(m || view); setEditing(null); setModalOpen(true); }, [view]);
  const openEdit = useCallback((e) => { setCurMonth(e.month); setEditing(e); setModalOpen(true); }, []);
  const handleSave = useCallback(async (fd) => {
    try {
      if (editing) { await updateExpense(editing.$id, curMonth, fd); showToast('Expense updated', 'success'); }
      else { await addExpense({ ...fd, month: curMonth, year: 2026 }); showToast('Expense added', 'success'); }
      setModalOpen(false);
    } catch (err) { console.error(err); showToast('Error saving expense', 'error'); }
  }, [curMonth, editing, addExpense, updateExpense, showToast]);
  const handleDelete = useCallback(async (e) => {
    if (!window.confirm('Delete this expense?')) return;
    try { await removeExpense(e.$id, e.month); showToast('Expense deleted', 'info'); }
    catch (err) { console.error(err); showToast('Error deleting expense', 'error'); }
  }, [removeExpense, showToast]);
  const openSum = useCallback((m) => { setSumMonth(m || view); setSumOpen(true); }, [view]);
  const handleSaveSum = useCallback(async (text) => {
    try { await saveSummary(sumMonth, text); showToast('Summary saved', 'success'); setSumOpen(false); }
    catch (err) { console.error(err); showToast('Error saving summary', 'error'); }
  }, [sumMonth, saveSummary, showToast]);
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading expenses...</span>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header expenses={expenses} />
        <NavTabs activeView={view} onChangeView={setView} />
        <main style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 24px 56px' }}>
          {view === 'dashboard' ? <Dashboard expenses={expenses} /> : (
            <MonthView month={view} expenses={expenses} summary={summaries[view] || ''} onAddExpense={() => openAdd(view)} onEditExpense={openEdit} onDeleteExpense={handleDelete} onOpenSummary={() => openSum(view)} />
          )}
        </main>
      </div>
      <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editingExpense={editing} />
      <SummaryModal open={sumOpen} onClose={() => setSumOpen(false)} onSave={handleSaveSum} month={sumMonth} initialText={sumMonth ? summaries[sumMonth] || '' : ''} />
      <ToastContainer toasts={toasts} />
    </div>
  );
}
export default App;