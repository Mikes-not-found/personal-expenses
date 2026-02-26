import { databases } from '../lib/appwrite';
import { Query, ID } from 'appwrite';

const DB = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COL = import.meta.env.VITE_APPWRITE_EXPENSES_COLLECTION_ID;

export async function listAllExpenses(year = 2026) {
  const docs = [];
  let cursor = undefined;

  while (true) {
    const queries = [Query.equal('year', year), Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));

    const res = await databases.listDocuments(DB, COL, queries);
    docs.push(...res.documents);

    if (res.documents.length < 100) break;
    cursor = res.documents[res.documents.length - 1].$id;
  }

  return docs;
}

export async function listByMonth(month, year = 2026) {
  const res = await databases.listDocuments(DB, COL, [
    Query.equal('month', month),
    Query.equal('year', year),
    Query.limit(100),
  ]);
  return res.documents;
}

export async function createExpense(data) {
  return databases.createDocument(DB, COL, ID.unique(), {
    name: data.name,
    date: data.date,
    amount: data.amount,
    primary: data.primary,
    secondary: data.secondary || '',
    month: data.month,
    year: data.year || 2026,
  });
}

export async function updateExpense(id, data) {
  return databases.updateDocument(DB, COL, id, {
    name: data.name,
    date: data.date,
    amount: data.amount,
    primary: data.primary,
    secondary: data.secondary || '',
  });
}

export async function deleteExpense(id) {
  return databases.deleteDocument(DB, COL, id);
}
