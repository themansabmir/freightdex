import Dropdown from '@shared/components/SingleDropdown';
import dayjs from 'dayjs';
import { Calendar, Eraser, Filter } from 'lucide-react';
import './ratefilter.scss';
import { Button } from '@shared/components';
import { useState } from 'react';
import { GetRateSheetsFilters } from '../index.types';

interface DropdownOption {
  label: string;
  value: string;
}

interface RateFiltersProps {
  filters: GetRateSheetsFilters;
  setFilters: React.Dispatch<React.SetStateAction<GetRateSheetsFilters>>;
  shippingLineOptions: DropdownOption[];
  containerType: DropdownOption[];
  containerSize: DropdownOption[];
  portOptions: DropdownOption[];
  tradeType: DropdownOption[];
  clearFilters: () => void;
}

const RateFilters = ({ 
  filters, 
  setFilters, 
  shippingLineOptions, 
  containerType, 
  containerSize, 
  portOptions, 
  tradeType, 
  clearFilters 
}: RateFiltersProps) => {
  const [toggleFilters, setToggleFilters] = useState(true);
  return (
    <div className="rate-filters">
      <div className="rate-filters__header">
        <h3>
          Filters <Filter size={16} onClick={() => setToggleFilters(!toggleFilters)} color={toggleFilters ? '#7a5af8' : '#333'} />
        </h3>
        <Button variant="destructive" onClick={clearFilters}>
         Clear   <Eraser size={16} className="ml-2" />
        </Button>
      </div>
      {toggleFilters && (
        <div className="rate-filters__grid">
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
              value={filters.effectiveFrom ? dayjs.utc(filters.effectiveFrom).tz('Asia/Kolkata').format('YYYY-MM-DD') : filters.effectiveFrom}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  effectiveFrom: new Date(e.target.value),
                }))
              }
            />
          </div>

          <div className="filter-item">
            <Calendar />
            <input
              type="date"
              className="date-input"
              value={filters.effectiveTo ? dayjs.utc(filters.effectiveTo).tz('Asia/Kolkata').format('YYYY-MM-DD') : filters.effectiveTo}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  effectiveTo: new Date(e.target.value),
                }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RateFilters;
