import { databases } from '../lib/appwrite';
import { Query, ID } from 'appwrite';

const DB = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COL = import.meta.env.VITE_APPWRITE_SUMMARIES_COLLECTION_ID;

export async function listAllSummaries(year = 2026) {
  const res = await databases.listDocuments(DB, COL, [
    Query.equal('year', year),
    Query.limit(12),
  ]);
  return res.documents;
}

export async function upsertSummary(month, text, year = 2026) {
  // Check if summary already exists
  const existing = await databases.listDocuments(DB, COL, [
    Query.equal('month', month),
    Query.equal('year', year),
    Query.limit(1),
  ]);

  if (existing.documents.length > 0) {
    return databases.updateDocument(DB, COL, existing.documents[0].$id, { text });
  }

  return databases.createDocument(DB, COL, ID.unique(), {
    month,
    year,
    text,
  });
}
