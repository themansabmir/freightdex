import React, { useMemo } from 'react';
import SingleDropdown from '../../../shared/components/SingleDropdown';
import { mockQuotations } from '../mockData';

interface CustomerSelectProps {
    selectedCustomerId: string | null;
    onChange: (customerId: string | null) => void;
}

const CustomerSelect: React.FC<CustomerSelectProps> = ({ selectedCustomerId, onChange }) => {
    const customerOptions = useMemo(() => {
        const uniqueCustomers = new Map();
        mockQuotations.forEach((q) => {
            if (!uniqueCustomers.has(q.customerId)) {
                uniqueCustomers.set(q.customerId, {
                    label: q.customerName,
                    value: q.customerId,
                });
            }
        });
        return Array.from(uniqueCustomers.values());
    }, []);

    return (
        <div className="w-64">
            <SingleDropdown
                options={customerOptions}
                value={customerOptions.find((opt) => opt.value === selectedCustomerId)?.value || null}
                onChange={(value: string | null) => onChange(value)}
                placeholder="Select Customer"

            />
        </div>
    );
};

export default CustomerSelect;
