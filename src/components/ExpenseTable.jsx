import { ExpenseRow } from './ExpenseRow';
const th = { textAlign: 'left', padding: '12px 16px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 };
export function ExpenseTable({ expenses, month, onEdit, onDelete }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={th}>Date</th>
              <th style={th}>Name</th>
              <th style={th}>Category</th>
              <th style={th}>Subcategory</th>
              <th style={{ ...th, textAlign: 'right' }}>Amount</th>
              <th style={{ ...th, textAlign: 'right', width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => <ExpenseRow key={exp.$id} expense={exp} month={month} onEdit={onEdit} onDelete={onDelete} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}