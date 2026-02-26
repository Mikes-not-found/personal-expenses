import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('6990bae50003e5419013');

const databases = new Databases(client);
const DB = 'expense-tracker';
const COL = 'expenses';

const expenses = [
  // ── January (29 records) ──
  { name: 'Colazione Mc', date: 2, amount: 4.1, primary: 'Out', secondary: 'Bar', month: 'jan' },
  { name: 'Ciabatte Stranger Things', date: 4, amount: 7.2, primary: 'Clothing', secondary: 'Scarpe', month: 'jan' },
  { name: 'Regalo Marco', date: 5, amount: 24.9, primary: 'Gifts', secondary: 'Gifts', month: 'jan' },
  { name: 'Sci Campitello Maltese', date: 5, amount: 40, primary: 'Travel', secondary: 'Travel', month: 'jan' },
  { name: 'Sto senza naftaa', date: 6, amount: 50, primary: 'Transport', secondary: 'Benzina', month: 'jan' },
  { name: 'Poke', date: 7, amount: 25, primary: 'Out', secondary: 'Asporto&Domicilio', month: 'jan' },
  { name: 'PagoPa Concorso Ministero', date: 7, amount: 11.5, primary: 'OtherExpenses', secondary: 'OtherExpenses', month: 'jan' },
  { name: 'Lavagna + cancellino', date: 8, amount: 10.4, primary: 'Leisure', secondary: 'OtherLeisure', month: 'jan' },
  { name: 'Abbonamento App Brain Training Annuale', date: 9, amount: 18.49, primary: 'Leisure', secondary: 'Games', month: 'jan' },
  { name: 'Arancina Cena', date: 9, amount: 8.15, primary: 'Out', secondary: 'Asporto&Domicilio', month: 'jan' },
  { name: 'Occhiali Sci + bocchetta bottiglia', date: 10, amount: 30.98, primary: 'Clothing', secondary: 'Accessori', month: 'jan' },
  { name: 'Colazione Mc Donald', date: 10, amount: 6.6, primary: 'Out', secondary: 'Bar', month: 'jan' },
  { name: 'Concorso Assistente informatico', date: 10, amount: 11.5, primary: 'OtherExpenses', secondary: 'OtherExpenses', month: 'jan' },
  { name: 'Pallavolo San Michele', date: 12, amount: 6, primary: 'Health', secondary: 'Sport', month: 'jan' },
  { name: 'Oki Task', date: 14, amount: 12, primary: 'Health', secondary: 'Medicine', month: 'jan' },
  { name: 'Focaccia Tony', date: 14, amount: 10, primary: 'Out', secondary: 'Asporto&Domicilio', month: 'jan' },
  { name: 'Psicologa', date: 15, amount: 70, primary: 'Health', secondary: 'Dottori', month: 'jan' },
  { name: 'Colazione McDonald', date: 17, amount: 4.1, primary: 'Out', secondary: 'Bar', month: 'jan' },
  { name: 'Colazione McDonald', date: 19, amount: 4.1, primary: 'Out', secondary: 'Bar', month: 'jan' },
  { name: 'Parcheggio Taranto Bpp', date: 20, amount: 3.65, primary: 'Transport', secondary: 'AltroMacchina', month: 'jan' },
  { name: 'Piccola Spesa', date: 21, amount: 9.4, primary: 'Groceries', secondary: 'OtherGrocerie', month: 'jan' },
  { name: 'Cioccolata McDonald', date: 21, amount: 5.2, primary: 'Out', secondary: 'Bar', month: 'jan' },
  { name: 'Benza', date: 23, amount: 50, primary: 'Transport', secondary: 'Benzina', month: 'jan' },
  { name: 'SCII', date: 25, amount: 66, primary: 'Travel', secondary: 'Travel', month: 'jan' },
  { name: 'Adattatore Macbook', date: 26, amount: 15.19, primary: 'Leisure', secondary: 'Tech', month: 'jan' },
  { name: 'Regalo Gregory', date: 27, amount: 15, primary: 'Gifts', secondary: 'Gifts', month: 'jan' },
  { name: 'Rata Monitor', date: 28, amount: 53.2, primary: 'Leisure', secondary: 'Tech', month: 'jan' },
  { name: 'Panzerotti', date: 31, amount: 18.5, primary: 'Out', secondary: 'Restaurants', month: 'jan' },

  // ── February (10 records) ──
  { name: 'Colazione', date: 1, amount: 5.24, primary: 'Out', secondary: 'Bar', month: 'feb' },
  { name: 'Mouse Lavoro', date: 2, amount: 20, primary: 'Leisure', secondary: 'Tech', month: 'feb' },
  { name: 'Psicologa', date: 3, amount: 70, primary: 'Health', secondary: 'Dottori', month: 'feb' },
  { name: 'Bowling + pizza', date: 3, amount: 30, primary: 'Out', secondary: 'AltreEsperienze', month: 'feb' },
  { name: 'Regalo Carriero', date: 4, amount: 15, primary: 'Gifts', secondary: 'Gifts', month: 'feb' },
  { name: 'Pizza Toto', date: 6, amount: 16, primary: 'Out', secondary: 'Asporto&Domicilio', month: 'feb' },
  { name: 'Abbonamento Google One', date: 7, amount: 20, primary: 'Leisure', secondary: 'Tech', month: 'feb' },
  { name: 'Kebab', date: 10, amount: 8.5, primary: 'Out', secondary: 'Asporto&Domicilio', month: 'feb' },
  { name: 'Wifi Pc', date: 10, amount: 33, primary: 'Leisure', secondary: 'Tech', month: 'feb' },
  { name: 'Gioco Descenders', date: 11, amount: 4.5, primary: 'Leisure', secondary: 'Games', month: 'feb' },
];

async function seed() {
  console.log(`Seeding ${expenses.length} expenses into Appwrite...\n`);

  let ok = 0;
  let fail = 0;

  for (const exp of expenses) {
    try {
      await databases.createDocument(DB, COL, ID.unique(), {
        name: exp.name,
        date: exp.date,
        amount: exp.amount,
        primary: exp.primary,
        secondary: exp.secondary,
        month: exp.month,
        year: 2026,
      });
      ok++;
      console.log(`  ✓ [${exp.month}] ${exp.name} — €${exp.amount}`);
    } catch (err) {
      fail++;
      console.error(`  ✗ [${exp.month}] ${exp.name} — ${err.message}`);
    }
  }

  console.log(`\nDone! ${ok} inserted, ${fail} failed.`);
}

seed();
