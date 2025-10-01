export const initialRow = () => ({
  item: "",
  amount: "",
  currency: "",
  exchangeRate: 1,
  qty: 1,
  priceUnit: 0,
  discount: 0,
  taxRate: 0,
});

export const calculateTotal = (rows: any[]) => {
  let taxTotal = 0;
  let grandTotal = 0;

  for (const row of rows) {
    const base = row.qty * row.priceUnit * row.exchangeRate - (row.discount || 0);
    const tax = (base * (row.taxRate || 0)) / 100;
    taxTotal += tax;
    grandTotal += base + tax;
  }

  return {
    taxTotal: taxTotal.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
  };
};
