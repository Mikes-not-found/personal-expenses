/**
 * Setup Appwrite database, collections, attributes and indexes.
 * Run once: APPWRITE_API_KEY=<your_key> node scripts/setup-appwrite.mjs
 *
 * NON committare mai la chiave direttamente nel codice!
 * Copia .env.example → .env e inserisci la tua API key lì.
 */
import { Client, Databases, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';
config(); // carica .env se presente

const ENDPOINT   = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6990bae50003e5419013';
const API_KEY    = process.env.APPWRITE_API_KEY;

if (!API_KEY) {
  console.error('❌  APPWRITE_API_KEY non trovata. Esporta la variabile prima di eseguire lo script:');
  console.error('   export APPWRITE_API_KEY=standard_xxxx   (Linux/macOS)');
  console.error('   set APPWRITE_API_KEY=standard_xxxx      (Windows CMD)');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db = new Databases(client);

const DATABASE_ID           = 'expense-tracker';
const EXPENSES_COLLECTION   = 'expenses';
const SUMMARIES_COLLECTION  = 'summaries';

const permissions = [
  Permission.read(Role.any()),
  Permission.create(Role.any()),
  Permission.update(Role.any()),
  Permission.delete(Role.any()),
];

async function setup() {
  console.log('Creating database...');
  try {
    await db.create(DATABASE_ID, 'Expense Tracker');
    console.log('  Database created');
  } catch (e) {
    if (e.code === 409 || e.code === 403) console.log('  Database already exists (or plan limit)');
    else throw e;
  }

  // --- Expenses collection ---
  console.log('Creating expenses collection...');
  try {
    await db.createCollection(DATABASE_ID, EXPENSES_COLLECTION, 'Expenses', permissions);
    console.log('  Collection created');
  } catch (e) {
    if (e.code === 409) console.log('  Collection already exists');
    else throw e;
  }

  const expenseAttrs = [
    () => db.createStringAttribute(DATABASE_ID, EXPENSES_COLLECTION, 'name', 200, true),
    () => db.createIntegerAttribute(DATABASE_ID, EXPENSES_COLLECTION, 'date', true, 1, 31),
    () => db.createFloatAttribute(DATABASE_ID, EXPENSES_COLLECTION, 'amount', true, 0),
    () => db.createStringAttribute(DATABASE_ID, EXPENSES_COLLECTION, 'primary', 50, true),
    () => db.createStringAttribute(DATABASE_ID, EXPENSES_COLLECTION, 'secondary', 50, false, ''),
    () => db.createStringAttribute(DATABASE_ID, EXPENSES_COLLECTION, 'month', 3, true),
    () => db.createIntegerAttribute(DATABASE_ID, EXPENSES_COLLECTION, 'year', true, 2020, 2100),
  ];

  for (const create of expenseAttrs) {
    try { await create(); console.log('  Attribute created'); }
    catch (e) { if (e.code === 409) console.log('  Attribute already exists'); else console.log('  Error:', e.message); }
  }

  console.log('Waiting for attributes to propagate...');
  await new Promise(r => setTimeout(r, 3000));

  const expenseIndexes = [
    () => db.createIndex(DATABASE_ID, EXPENSES_COLLECTION, 'idx_month_year', 'key', ['month', 'year']),
    () => db.createIndex(DATABASE_ID, EXPENSES_COLLECTION, 'idx_primary',    'key', ['primary']),
    () => db.createIndex(DATABASE_ID, EXPENSES_COLLECTION, 'idx_year',       'key', ['year']),
  ];

  for (const create of expenseIndexes) {
    try { await create(); console.log('  Index created'); }
    catch (e) { if (e.code === 409) console.log('  Index already exists'); else console.log('  Index error:', e.message); }
  }

  // --- Summaries collection ---
  console.log('Creating summaries collection...');
  try {
    await db.createCollection(DATABASE_ID, SUMMARIES_COLLECTION, 'Summaries', permissions);
    console.log('  Collection created');
  } catch (e) {
    if (e.code === 409) console.log('  Collection already exists');
    else throw e;
  }

  const summaryAttrs = [
    () => db.createStringAttribute(DATABASE_ID, SUMMARIES_COLLECTION, 'month', 3, true),
    () => db.createIntegerAttribute(DATABASE_ID, SUMMARIES_COLLECTION, 'year', true, 2020, 2100),
    () => db.createStringAttribute(DATABASE_ID, SUMMARIES_COLLECTION, 'text', 5000, false, ''),
  ];

  for (const create of summaryAttrs) {
    try { await create(); console.log('  Attribute created'); }
    catch (e) { if (e.code === 409) console.log('  Attribute already exists'); else console.log('  Error:', e.message); }
  }

  console.log('Waiting for attributes to propagate...');
  await new Promise(r => setTimeout(r, 3000));

  try {
    await db.createIndex(DATABASE_ID, SUMMARIES_COLLECTION, 'idx_month_year', 'unique', ['month', 'year']);
    console.log('  Unique index created');
  } catch (e) {
    if (e.code === 409) console.log('  Index already exists');
    else console.log('  Index error:', e.message);
  }

  console.log('\n✅ Done! Aggiungi queste variabili al tuo .env:');
  console.log(`VITE_APPWRITE_DATABASE_ID="${DATABASE_ID}"`);
  console.log(`VITE_APPWRITE_EXPENSES_COLLECTION_ID="${EXPENSES_COLLECTION}"`);
  console.log(`VITE_APPWRITE_SUMMARIES_COLLECTION_ID="${SUMMARIES_COLLECTION}"`);
}

setup().catch(console.error);
