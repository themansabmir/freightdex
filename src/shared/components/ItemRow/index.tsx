import React from 'react';
import { Trash, Pencil } from 'lucide-react';
import './ServiceItemRow.scss';

export interface ServiceItem {
  id?: string | number;
  fieldName: string;
  hsn_code: string;
  gst: string | number;
  unit: string;
}

interface ServiceItemRowProps {
  item: ServiceItem;
  onEdit: (item: ServiceItem) => void;
  onDelete: (id: string | number) => void;
  isDeleting?: boolean;
  isEditing?: boolean;
  className?: string;
}

const ServiceItemRow: React.FC<ServiceItemRowProps> = (props) => {
  const {
    item,
    onEdit,
    onDelete,
    isDeleting = false,
    isEditing = false,
    className = ''
  } = props;
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isEditing) {
      onEdit(item);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDeleting && item?.id) {
      onDelete(item?.id);
    }
  };

  return (
    <div className={`service-item-row my-6 ${className}`}>
      <div className="item-details" style={{display: 'grid', gridTemplateColumns: '250px 50px 50px 50px' }}>
        <span className="item-name ">{item.fieldName}</span>
        <span className="item-price">{item.hsn_code}</span>
        <span className="item-price">{item.gst}</span>
        <span className="item-price">{item.unit}</span>

      </div>
      <div className="item-actions">
        <button
          type="button"
          className="action-button edit-button"
          onClick={handleEdit}
          disabled={isEditing}
          aria-label={`Edit ${item.fieldName}`}
          title="Edit"
        >
          <Pencil size={18} className="action-icon" color='#7f56d9' />
        </button>
        <button
          type="button"
          className="action-button delete-button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${item.fieldName}`}
          title="Delete"
        >
          <Trash className="action-icon" size={18} color='#d92d20' />
        </button>
      </div>
    </div>
  );
};

export default ServiceItemRow;
