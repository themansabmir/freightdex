import React, { useEffect, useState } from 'react';
import { IQuotationLineItem } from '../index.types';
import { Plus, Trash2 } from 'lucide-react';

interface LineItemsSheetProps {
    items: IQuotationLineItem[];
    onChange: (items: IQuotationLineItem[]) => void;
}

const LineItemsSheet: React.FC<LineItemsSheetProps> = ({ items, onChange }) => {
    const [localItems, setLocalItems] = useState<IQuotationLineItem[]>(items);

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleItemChange = (index: number, field: keyof IQuotationLineItem, value: any) => {
        const newItems = [...localItems];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-calculate total amount
        if (field === 'price' || field === 'quantity') {
            const price = parseFloat(newItems[index].price as any) || 0;
            const quantity = parseFloat(newItems[index].quantity as any) || 0;
            newItems[index].totalAmount = price * quantity;
        }

        setLocalItems(newItems);
        onChange(newItems);
    };

    const addItem = () => {
        const newItem: IQuotationLineItem = {
            _id: `temp-${Date.now()}`,
            quotationId: '',
            chargeName: '',
            hsnCode: '',
            price: 0,
            currency: 'USD',
            quantity: 1,
            totalAmount: 0,
        };
        const newItems = [...localItems, newItem];
        setLocalItems(newItems);
        onChange(newItems);
    };

    const removeItem = (index: number) => {
        const newItems = localItems.filter((_, i) => i !== index);
        setLocalItems(newItems);
        onChange(newItems);
    };

    return (
        <div className="w-full overflow-x-auto border rounded-md shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-3">Charge Name</th>
                        <th className="px-4 py-3">HSN Code</th>
                        <th className="px-4 py-3">Currency</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {localItems.map((item, index) => (
                        <tr key={item._id || index} className="bg-white border-b hover:bg-gray-50">
                            <td className="p-2">
                                <input
                                    type="text"
                                    value={item.chargeName}
                                    onChange={(e) => handleItemChange(index, 'chargeName', e.target.value)}
                                    className="w-full p-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Charge Name"
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="text"
                                    value={item.hsnCode}
                                    onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
                                    className="w-full p-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="HSN"
                                />
                            </td>
                            <td className="p-2">
                                <select
                                    value={item.currency}
                                    onChange={(e) => handleItemChange(index, 'currency', e.target.value)}
                                    className="w-full p-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="INR">INR</option>
                                </select>
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                    className="w-full p-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    min="0"
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    className="w-full p-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    min="1"
                                />
                            </td>
                            <td className="p-2 font-medium">
                                {item.totalAmount.toFixed(2)}
                            </td>
                            <td className="p-2">
                                <button
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-2 bg-gray-50 border-t">
                <button
                    onClick={addItem}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                >
                    <Plus size={16} /> Add Line Item
                </button>
            </div>
        </div>
    );
};

export default LineItemsSheet;
