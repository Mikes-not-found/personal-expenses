import { useState, useEffect, useRef } from 'react';
import { categories, categorySubcategories } from '../constants/categories';

const inp = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' };
const lbl = { display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 };

export function ExpenseModal({ open, onClose, onSave, editingExpense }) {
  const ref = useRef(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const subs = primary ? categorySubcategories[primary] || [] : [];
  const isEdit = !!editingExpense;
  
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);
  
  useEffect(() => {
    if (editingExpense) { setName(editingExpense.name || ''); setDate(String(editingExpense.date || '')); setAmount(String(editingExpense.amount || '')); setPrimary(editingExpense.primary || ''); setSecondary(editingExpense.secondary || ''); }
    else { setName(''); setDate(''); setAmount(''); setPrimary(''); setSecondary(''); }
  }, [editingExpense, open]);
  
  const submit = (e) => { e.preventDefault(); if (!name.trim() || !date || !amount || !primary) return; onSave({ name: name.trim(), date: parseInt(date), amount: parseFloat(amount), primary, secondary: secondary || '' }); };
  
  return (
    <dialog 
      ref={ref} 
      onClick={e => e.target === ref.current && onClose()} 
      onCancel={onClose} 
      style={{
        borderRadius: 16, 
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)', 
        width: '100%', 
        maxWidth: 480 
      }}
    >
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{isEdit ? 'Edit Expense' : 'New Expense'}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
          </button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={lbl}>Expense Name *</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Grocery shopping" required style={inp} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl}>Day of Month *</label><input type="number" min="1" max="31" value={date} onChange={e => setDate(e.target.value)} placeholder="1-31" required style={{ ...inp, fontFamily: 'var(--font-mono)' }} /></div>
            <div><label style={lbl}>Amount (EUR) *</label><input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required style={{ ...inp, fontFamily: 'var(--font-mono)' }} /></div>
          </div>
          <div><label style={lbl}>Category *</label><select value={primary} onChange={e => { setPrimary(e.target.value); setSecondary(''); }} required style={{ ...inp, cursor: 'pointer' }}><option value="">Select category...</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label style={lbl}>Subcategory</label><select value={secondary} onChange={e => setSecondary(e.target.value)} disabled={!primary} style={{ ...inp, cursor: primary ? 'pointer' : 'not-allowed', opacity: primary ? 1 : 0.4 }}><option value="">{primary ? 'Select...' : 'Select category first...'}</option>{subs.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 18px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button type="submit" style={{ padding: '10px 22px', fontSize: 13, fontWeight: 600, color: '#0a0e14', background: 'var(--accent)', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>{isEdit ? 'Update' : 'Add Expense'}</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}