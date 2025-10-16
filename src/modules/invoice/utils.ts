
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

export const calculateRowValues = (row: any) => {
  const rate = row.rate || 0;
  const exchangeRate = row.exchangeRate || 1;
  const quantity = row.quantity || 0;
  const discount = row.discount || 0;
  const gstPercent = row.gstPercent || 0;

  // Calculate Price/Unit = rate * exchange_rate
  const pricePerUnit = rate * exchangeRate;

  // Calculate Total Price = rate * exchange_rate * quantity
  const totalPrice = rate * exchangeRate * quantity;

  // Calculate Taxable Amount = Total Price - discount
  const taxableAmount = totalPrice - discount;

  // Calculate GST Amount = taxable * (gst% / 100)
  const gstAmount = taxableAmount * (gstPercent / 100);

  // Calculate Total with GST = taxable + gst amount
  const totalWithGst = taxableAmount + gstAmount;

  return {
    ...row,
    pricePerUnit,
    taxableAmount,
    gstAmount,
    totalWithGst,
  };
};

export const updateRowAtIndex = (rows: any[], idx: number, patch: Partial<any>) => {
  const copy = [...rows];
  const updatedRow = { ...copy[idx], ...patch };
  
  // Calculate all values using the utility function
  const calculatedRow = calculateRowValues(updatedRow);
  
  copy[idx] = calculatedRow;

  // Add new row if this is the last row
  if (idx === copy.length - 1) {
    copy.push(blankRow());
  }
  return copy;
};

export const blankRow = () => {
  return {
    _id:'',
    serviceItem: '',
    hsn_code: '',
    rate: 0,
    currency: 'INR',
    unit: '',
    exchangeRate: 1,
    quantity: 1,
    pricePerUnit: 0,
    discount: 0,
    taxableAmount: 0,
    gstPercent: 0,
    gstAmount: 0,
    totalWithGst: 0,
  };
};