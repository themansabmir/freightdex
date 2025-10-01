export const TAX_OPTIONS = [
    { label: "GST@5%", value: 5 },
    { label: "GST@12%", value: 12 },
    { label: "GST@18%", value: 18 },
    { label: "GST@28%", value: 28 },
];

export default function InvoiceRow({ index, row, onChange, onDelete }) {
    const handleInput = (field) => (e) =>
        onChange(index, field, e.target.value);

    const priceTotal = row.qty * row.priceUnit * row.exchangeRate;
    const discountAmt = row.discount || 0;
    const taxable = priceTotal - discountAmt;
    const taxAmt = row.taxRate ? (taxable * row.taxRate) / 100 : 0;
    const finalAmt = taxable + taxAmt;

    return (
        <tr>
            <td>{index + 1}</td>
            <td><input value={row.item} onChange={handleInput("item")} /></td>
            <td><input value={row.amount} onChange={handleInput("amount")} /></td>
            <td><input value={row.currency} onChange={handleInput("currency")} /></td>
            <td><input value={row.exchangeRate} onChange={handleInput("exchangeRate")} /></td>
            <td><input value={row.qty} onChange={handleInput("qty")} /></td>
            <td><input value={row.priceUnit} onChange={handleInput("priceUnit")} /></td>
            <td><input value={row.discount} onChange={handleInput("discount")} /></td>
            <td>
                <select value={row.taxRate} onChange={handleInput("taxRate")}>
                    <option value="">Select</option>
                    {TAX_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </td>
            <td>{taxAmt.toFixed(2)}</td>
            <td>{finalAmt.toFixed(2)}</td>
            <td>
                <button onClick={() => onDelete(index)} className="text-red-600">🗑️</button>
            </td>
        </tr>
    );
}
