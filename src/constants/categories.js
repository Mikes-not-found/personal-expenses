export const categorySubcategories = {
  Housing: ['Rent', 'SpeseCondo', 'Internet', 'Furniture', 'Insurances', 'Cleaning', 'TV', 'Electricity', 'Phone'],
  Health: ['Dottori', 'Medicine', 'Sport', 'Palestra'],
  Groceries: ['Migros', 'Coop', 'OtherGrocerie'],
  Transport: ['Treno', 'Benzina', 'AltroMacchina'],
  Out: ['Restaurants', 'Bar', 'Asporto&Domicilio', 'Cinema', 'AltreEsperienze'],
  Travel: ['Travel', 'Concerts'],
  Clothing: ['Robe', 'Accessori', 'Scarpe', 'Makeup', 'Skincare', 'Hair'],
  Leisure: ['Tech', 'Books', 'Leisure', 'Learning', 'Games', 'OtherLeisure'],
  Gifts: ['Gifts'],
  Fees: ['Brokers', 'Banks', 'Consulting', 'OtherFees'],
  OtherExpenses: ['Pepe', 'OtherExpenses'],
};

export const categories = Object.keys(categorySubcategories);

export const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export const monthNames = {
  jan: 'January', feb: 'February', mar: 'March', apr: 'April',
  may: 'May', jun: 'June', jul: 'July', aug: 'August',
  sep: 'September', oct: 'October', nov: 'November', dec: 'December',
};

export const monthShortNames = {
  jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
  may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
  sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
};

export function getMonthNumber(month) {
  return (months.indexOf(month) + 1).toString().padStart(2, '0');
}

export function formatEuro(amount) {
  return `\u20AC ${Number(amount).toFixed(2)}`;
}
