import { useState } from "react";
import InvoiceRow from "./InvoiceRow";
import { calculateTotal, initialRow } from "./utils";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePdf";
const invoiceData = {
    id: "INV-1001",
    date: "2025-07-21",
    terms: "Net 30 Days",

    billTo: {
        name: "Acme Logistics Pvt Ltd",
        address: "123 Industrial Road, Mumbai, Maharashtra, 400001"
    },

    shipTo: {
        name: "Blue Ocean Exports",
        address: "42 Marine Drive, Kochi, Kerala, 682001"
    },

    items: [
        {
            description: "Ocean Freight",
            qty: 7.01105,
            unitPrice: 1947,
            tax: 5,
            total: 14333.04
        },
        {
            description: "Inland Haulage",
            qty: 7.01105,
            unitPrice: 2655,
            tax: 18,
            total: 21964.92
        },
        {
            description: "Terminal Handling Charges",
            qty: 7.01105,
            unitPrice: 624,
            tax: 18,
            total: 5162.38
        },
        {
            description: "DO Fee",
            qty: 1,
            unitPrice: 3000,
            tax: 18,
            total: 3540
        }
    ],

    taxTotal: 5360.59,
    grandTotal: 45000.33
};
export default function InvoiceTable() {
    const [rows, setRows] = useState([initialRow()]);

    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], [field]: value };
        setRows(updatedRows);
    };

    const handleAddRow = () => setRows([...rows, initialRow()]);
    const handleDeleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

    const totals = calculateTotal(rows);

    return (
        <div className="overflow-auto">
            <table className="w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Amount</th>
                        <th>Currency / Unit</th>
                        <th>Exchange Rate</th>
                        <th>Qty</th>
                        <th>Price/Unit</th>
                        <th>Discount</th>
                        <th>Tax</th>
                        <th>Tax Amt</th>
                        <th>Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <InvoiceRow
                            key={index}
                            index={index}
                            row={row}
                            onChange={handleChange}
                            onDelete={handleDeleteRow}
                        />
                    ))}
                    <tr className="bg-gray-100 font-semibold">
                        <td colSpan={8}>TOTAL</td>
                        <td></td>
                        <td>{totals.taxTotal}</td>
                        <td>{totals.grandTotal}</td>
                    </tr>
                </tbody>
            </table>
            <button
                onClick={handleAddRow}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Row
            </button>

            <PDFDownloadLink
                document={<InvoicePDF invoiceData={invoiceData} />}
                fileName="invoice.pdf"
            >
                {({ loading }) => (loading ? "Loading..." : "Download Invoice PDF")}
            </PDFDownloadLink>

        </div>
    );
}
