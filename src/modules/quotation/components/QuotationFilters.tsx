import Dropdown from '@shared/components/SingleDropdown';
import dayjs from 'dayjs';
import { Calendar, Eraser, Filter } from 'lucide-react';
import { Button } from '@shared/components';
import { useState } from 'react';
import { IQuotationFilters } from '../index.types';
import '@modules/rate_master/component/ratefilter.scss'; // Reuse styles

interface DropdownOption {
    label: string;
    value: string;
}

interface QuotationFiltersProps {
    filters: IQuotationFilters;
    setFilters: React.Dispatch<React.SetStateAction<IQuotationFilters>>;
    customerOptions: DropdownOption[];
    shippingLineOptions: DropdownOption[];
    containerType: DropdownOption[];
    containerSize: DropdownOption[];
    portOptions: DropdownOption[];
    tradeType: DropdownOption[];
    clearFilters: () => void;
    isFormMode?: boolean;
}

const QuotationFilters = ({
    filters,
    setFilters,
    customerOptions,
    shippingLineOptions,
    containerType,
    containerSize,
    portOptions,
    tradeType,
    clearFilters,
    isFormMode = false
}: QuotationFiltersProps) => {
    const [toggleFilters, setToggleFilters] = useState(true);

    const showGrid = isFormMode || toggleFilters;

    return (
        <div className={`rate-filters ${isFormMode ? 'rate-filters--form' : ''}`}>
            {!isFormMode && (
                <div className="rate-filters__header">
                    <h3>
                        Filters <Filter size={16} onClick={() => setToggleFilters(!toggleFilters)} color={toggleFilters ? '#7a5af8' : '#333'} />
                    </h3>
                    <Button variant="destructive" onClick={clearFilters}>
                        Clear   <Eraser size={16} className="ml-2" />
                    </Button>
                </div>
            )}
            {showGrid && (
                <div className="rate-filters__grid">
                    <Dropdown
                        value={filters.customerId || null}
                        options={customerOptions}
                        placeholder="Customer"
                        onChange={(value) => setFilters({ ...filters, customerId: value || '' })}
                    />

                    <Dropdown
                        value={filters.shippingLineId || null}
                        options={shippingLineOptions}
                        placeholder="Shipping Line"
                        onChange={(value) => setFilters({ ...filters, shippingLineId: value || '' })}
                    />

                    <Dropdown
                        value={filters.containerType || null}
                        options={containerType}
                        placeholder="Container Type"
                        onChange={(value) => setFilters({ ...filters, containerType: value || '' })}
                    />

                    <Dropdown
                        value={filters.containerSize || null}
                        options={containerSize}
                        placeholder="Container Size"
                        onChange={(value) => setFilters({ ...filters, containerSize: value || '' })}
                    />

                    <Dropdown
                        value={filters.startPortId || null}
                        options={portOptions}
                        placeholder="Start Port"
                        onChange={(value) => setFilters({ ...filters, startPortId: value || '' })}
                    />

                    <Dropdown
                        value={filters.endPortId || null}
                        options={portOptions}
                        placeholder="End Port"
                        onChange={(value) => setFilters({ ...filters, endPortId: value || '' })}
                    />

                    <Dropdown
                        value={filters.tradeType || null}
                        options={tradeType}
                        placeholder="Trade Type"
                        onChange={(value) => setFilters({ ...filters, tradeType: value || '' })}
                    />

                    <div className="filter-item">
                        <Calendar />
                        <input
                            type="date"
                            className="date-input"
                            value={filters.validFrom ? dayjs(filters.validFrom).format('YYYY-MM-DD') : ''}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    validFrom: e.target.value ? new Date(e.target.value) : undefined,
                                }))
                            }
                        />
                    </div>

                    <div className="filter-item">
                        <Calendar />
                        <input
                            type="date"
                            className="date-input"
                            value={filters.validTo ? dayjs(filters.validTo).format('YYYY-MM-DD') : ''}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    validTo: e.target.value ? new Date(e.target.value) : undefined,
                                }))
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotationFilters;
