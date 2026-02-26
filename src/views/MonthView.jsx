import { monthNames, formatEuro } from '../constants/categories';
import { ExpenseTable } from '../components/ExpenseTable';
import { EmptyState } from '../components/EmptyState';
const btnPrimary = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--accent)', color: '#0a0e14', fontWeight: 600, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' };
const btnGhost = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 13, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' };
export function MonthView({ month, expenses, summary, onAddExpense, onEditExpense, onDeleteExpense, onOpenSummary }) {
  const list = expenses[month] || [];
  const total = list.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{monthNames[month]} <span style={{ color: 'var(--accent)' }}>2026</span></h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{formatEuro(total)}</div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button style={btnPrimary} onClick={onAddExpense}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/></svg>
          Add Expense
        </button>
        <button style={btnGhost} onClick={onOpenSummary}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zM1.75 1a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h12.5a.75.75 0 00.75-.75V1.75a.75.75 0 00-.75-.75H1.75zM3.5 3.5h9v1.5h-9V3.5zM3.5 7h9v1.5h-9V7zM3.5 10.5h5v1.5h-5v-1.5z"/></svg>
          Monthly Summary
        </button>
      </div>
      <div onClick={onOpenSummary} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>Monthly Summary</span>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: summary ? 'var(--text-secondary)' : 'var(--text-muted)', fontStyle: summary ? 'normal' : 'italic' }}>
          {summary || 'Click to write your monthly summary, reflections, and goals...'}
        </p>
      </div>
      {list.length === 0 ? <EmptyState onAdd={onAddExpense} /> : <ExpenseTable expenses={list} month={month} onEdit={onEditExpense} onDelete={onDeleteExpense} />}
      {list.length > 0 && (
        <button onClick={onAddExpense} style={{ position: 'fixed', bottom: 32, right: 32, width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', color: '#0a0e14', fontSize: 28, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(79,195,247,0.25)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      )}
    </div>
  );
}