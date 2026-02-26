import { getMonthNumber, formatEuro } from '../constants/categories';
const td = { padding: '12px 16px' };
const iconBtn = { border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-muted)', transition: 'all 0.15s', display: 'inline-flex' };
export function ExpenseRow({ expense, month, onEdit, onDelete }) {
  const dateStr = `${String(expense.date).padStart(2, '0')}/${getMonthNumber(month)}/2026`;
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <td style={td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{dateStr}</span></td>
      <td style={td}><span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{expense.name}</span></td>
      <td style={td}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, background: 'var(--accent-muted)', color: 'var(--accent)', fontSize: 11, fontWeight: 500 }}>{expense.primary}</span></td>
      <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 12 }}>{expense.secondary || '\u2014'}</td>
      <td style={{ ...td, textAlign: 'right' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--c-red)' }}>{formatEuro(expense.amount)}</span></td>
      <td style={{ ...td, textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <button style={iconBtn} onClick={() => onEdit(expense)} title="Edit">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L3.462 11.098a.25.25 0 00-.064.108l-.631 2.208 2.208-.63a.25.25 0 00.108-.064l8.61-8.61a.25.25 0 000-.355l-1.086-1.086z"/></svg>
          </button>
          <button style={iconBtn} onClick={() => onDelete(expense)} title="Delete">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19a1.75 1.75 0 001.741-1.575l.66-6.6a.75.75 0 00-1.492-.15l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  );
}