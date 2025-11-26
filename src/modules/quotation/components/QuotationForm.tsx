import React, { useEffect, useState } from 'react';
import { IQuotation, IQuotationLineItem, IQuotationFilters } from '../index.types';
import LineItemsSheet from './LineItemsSheet';
import { ArrowLeft, Save } from 'lucide-react';
import { mockQuotationLineItems } from '../mockData';
import QuotationFilters from './QuotationFilters';

interface DropdownOption {
    label: string;
    value: string;
}

interface QuotationFormProps {
    quotation: IQuotation | null;
    onSave: (quotation: IQuotation, lineItems: IQuotationLineItem[]) => void;
    onCancel: () => void;
    customerOptions: DropdownOption[];
    shippingLineOptions: DropdownOption[];
    containerType: DropdownOption[];
    containerSize: DropdownOption[];
    portOptions: DropdownOption[];
    tradeType: DropdownOption[];
}

const QuotationForm: React.FC<QuotationFormProps> = ({
    quotation,
    onSave,
    onCancel,
    customerOptions,
    shippingLineOptions,
    containerType,
    containerSize,
    portOptions,
    tradeType
}) => {
    const [formData, setFormData] = useState<IQuotation>({
        _id: '',
        quotationNumber: `QT-${Math.floor(Math.random() * 10000)}`,
        customerId: '',
        customerName: '',
        customerEmail: '',
        shippingLineId: '',
        startPortId: '',
        endPortId: '',
        containerType: '',
        containerSize: '',
        tradeType: '',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    const [lineItems, setLineItems] = useState<IQuotationLineItem[]>([]);

    useEffect(() => {
        if (quotation) {
            setFormData(quotation);
            // Load associated line items from mock data
            const items = mockQuotationLineItems.filter(item => item.quotationId === quotation._id);
            setLineItems(items);
        } else {
            // Reset form for new quotation
            setFormData({
                _id: '',
                quotationNumber: `QT-${Math.floor(Math.random() * 10000)}`,
                customerId: '',
                customerName: '',
                customerEmail: '',
                shippingLineId: '',
                startPortId: '',
                endPortId: '',
                containerType: '',
                containerSize: '',
                tradeType: '',
                validFrom: new Date().toISOString().split('T')[0],
                validTo: new Date().toISOString().split('T')[0],
                status: 'DRAFT',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            setLineItems([]);
        }
    }, [quotation]);

    // Adapter to use QuotationFilters with formData
    const filters: IQuotationFilters = {
        customerId: formData.customerId,
        shippingLineId: formData.shippingLineId,
        containerType: formData.containerType,
        containerSize: formData.containerSize,
        startPortId: formData.startPortId,
        endPortId: formData.endPortId,
        tradeType: formData.tradeType,
        validFrom: formData.validFrom ? new Date(formData.validFrom) : undefined,
        validTo: formData.validTo ? new Date(formData.validTo) : undefined,
    };

    const setFilters = (action: React.SetStateAction<IQuotationFilters>) => {
        const newFilters = typeof action === 'function' ? action(filters) : action;
        setFormData(prev => ({
            ...prev,
            customerId: newFilters.customerId,
            shippingLineId: newFilters.shippingLineId,
            containerType: newFilters.containerType,
            containerSize: newFilters.containerSize,
            startPortId: newFilters.startPortId,
            endPortId: newFilters.endPortId,
            tradeType: newFilters.tradeType,
            validFrom: newFilters.validFrom ? newFilters.validFrom.toISOString().split('T')[0] : prev.validFrom,
            validTo: newFilters.validTo ? newFilters.validTo.toISOString().split('T')[0] : prev.validTo,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, lineItems);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold">
                        {quotation ? 'Edit Quotation' : 'Create Quotation'}
                    </h2>
                </div>
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    <Save size={18} /> Save Quotation
                </button>
            </div>

            <div className="mb-8">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Number </label>
                    <input
                        type="text"
                        value={formData.quotationNumber}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-50 max-w-xs"
                    />
                </div>

                <QuotationFilters
                    filters={filters}
                    setFilters={setFilters}
                    customerOptions={customerOptions}
                    shippingLineOptions={shippingLineOptions}
                    containerType={containerType}
                    containerSize={containerSize}
                    portOptions={portOptions}
                    tradeType={tradeType}
                    clearFilters={() => { }} // No-op for form
                    isFormMode={true}
                />
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Line Items</h3>
                <LineItemsSheet items={lineItems} onChange={setLineItems} />
            </div>
        </div>
    );
};

export default QuotationForm;
