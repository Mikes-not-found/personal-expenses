import { useState, useEffect, useRef } from 'react';
import { monthNames } from '../constants/categories';
export function SummaryModal({ open, onClose, onSave, month, initialText }) {
  const ref = useRef(null);
  const [text, setText] = useState('');
  useEffect(() => { const d = ref.current; if (!d) return; if (open && !d.open) d.showModal(); else if (!open && d.open) d.close(); }, [open]);
  useEffect(() => { setText(initialText || ''); }, [initialText, open]);
  return (
    <dialog ref={ref} onClick={e => e.target === ref.current && onClose()} onCancel={onClose} style={{ borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.5)', width: '100%', maxWidth: 560 }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{month ? `${monthNames[month]} Summary` : 'Monthly Summary'}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Write your monthly reflections, goals, and spending notes.</p>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write your thoughts for this month..." rows={8} style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', resize: 'vertical', minHeight: 160, lineHeight: 1.6, fontFamily: 'inherit' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{text.length} characters</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 18px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => onSave(text)} style={{ padding: '10px 22px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--c-green)', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Save Summary</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}