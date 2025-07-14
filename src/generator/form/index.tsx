import { Button, Checkbox, TextField } from '@shared/components';
import MultiSelectInput from '@shared/components/Dropdown';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DynamicFormProps, ArrayFieldSchema, RenderArrayFieldProps, RenderGroupProps, RenderFieldProps, Data } from './index.types';
import Dropdown from '@shared/components/SingleDropdown';
import { get } from 'lodash';
import { dayjs } from '@lib/dayjs';

const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => {
  return (
    <label className="dropdown__trigger__label">
      {label} {required && <span className="label__required">*</span>}
    </label>
  );
};

function RenderField({ field, value, onChange, error }: RenderFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  if (['text', 'email', 'password'].includes(field.type)) {
    return (
      <TextField
        {...field}
        value={value}
        onChange={handleChange}
        isError={!!error}
        errorText={error}
        placeholder={field.placeholder ?? field.name?.toUpperCase()}
      />
    );
  }

  if (field.type === 'checkbox' && field.options) {
    const selected: string[] = value || [];
    const toggle = (val: string) => {
      const updated = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
      onChange(updated);
    };
    return (
      <div>
        <FieldLabel label={field.label} required={field.required} />
        <div style={{ display: 'flex' }}>
          {field.options.map((opt) => (
            <Checkbox
              disabled={field.disabled}
              key={opt.value}
              onChange={() => toggle(opt.value)}
              checked={selected.includes(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return <Checkbox disabled={field.disabled} onChange={(e) => onChange(e.target.checked)} checked={!!value} label={field.label} />;
  }

  if (field.type === 'radio') {
    return (
      <div style={{ marginBottom: 12 }}>
        <label>{field.label}</label>
        <br />
        {field.options?.map((opt) => (
          <label key={opt.value}>
            <input
              disabled={field.disabled}
              type="radio"
              name={field.name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />{' '}
            {opt.label}
          </label>
        ))}
      </div>
    );
  }

  if (field.type === 'multiselect') {
    const selected: string[] = value || field?.selectedOptions || [];

    const toggle = (val: string) => {
      const updated = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
      onChange(updated);
    };
    return (
      <MultiSelectInput
        label={field.label}
        isError={!!error}
        errorText={error}
        options={field.options || []}
        disabled={field.disabled}
        name={field.name}
        onSelect={(item: string) => toggle(item)}
        selectedValues={selected}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        inputValue={input}
        onInputChange={setInput}
      />
    );
  }

  if (field.type === 'dropdown') {
    return (
      <Dropdown
        label={field.label}
        name={field.name}
        options={field.options}
        disabled={field.disabled}
        required={field.required}
        value={value}
        onChange={(item) => onChange(item)}
        placeholder={field.placeholder}
        searchable
        isError={!!error}
        errorText={error}
      />
    );
  }

  if (field.type === 'date') {
    return (
      <div>
        <FieldLabel label={field.label} required={field.required} />
        <br />
        <input
          className="custom-date-input"
          value={value ? dayjs.utc(value).tz('Asia/Kolkata').format('YYYY-MM-DD') : value}
          style={{ backgroundColor: field.disabled ? '#dddee1' : 'white' }}
          onChange={handleChange}
          {...field}
          type="date"
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <FieldLabel label={field.label} required={field.required} />

        <textarea {...field} rows={5} style={{ width: '100%' }}></textarea>
      </div>
    );
  }

  return null;
}

function RenderGroup({ fields, value, onChange, isViewMode = false, errors = {}, fieldPathPrefix = '' }: RenderGroupProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {fields.map((f) => {
        const fullPath = fieldPathPrefix ? `${fieldPathPrefix}.${f.name}` : f.name;
        const fieldError = get(errors, fullPath);

        return (
          <RenderField
            key={fullPath}
            error={fieldError}
            field={{ ...f, disabled: f.disabled || isViewMode }}
            value={value?.[f.name]}
            onChange={(val) => onChange({ ...value, [f.name]: val })}
          />
        );
      })}
    </div>
  );
}

function RenderArrayField({ field, value = [], onChange, isViewMode, errors = {} }: RenderArrayFieldProps) {
  const addItem = () => onChange([...value, {}]);
  const removeItem = (idx: number) => {
    const updated = [...value];
    updated.splice(idx, 1);
    onChange(updated);
  };

  return (
    <div className="field__group">
      <h4>
        {field.label} {field.required && <span className="label__required">*</span>} {value.length > 0 && value.length}
      </h4>
      {value.map((itemVal, idx) => {
        const itemPathPrefix = `${field.name}.${idx}`;
        return (
          <div key={idx} className="field__group field__wrapper">
            <RenderGroup
              fields={field.item.fields}
              value={itemVal}
              isViewMode={isViewMode}
              onChange={(val) => {
                const updated = [...value];
                updated[idx] = val;
                onChange(updated);
              }}
              errors={errors}
              fieldPathPrefix={itemPathPrefix}
            />
            <button onClick={() => removeItem(idx)} className="field__wrapper" disabled={isViewMode || (field.required && value.length < 2)}>
              <Trash2 color="red" size={18} />
            </button>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button disabled={isViewMode} onClick={addItem}>
          + Add {field.label}
        </Button>
      </div>
    </div>
  );
}

function DynamicForm<T extends Record<string, unknown>>({ schema, data, setData, isViewMode = false, onChange, errors = {} }: DynamicFormProps<T>) {
  const handleChange = (name: string, val: unknown) => {
    onChange(name, val);
    setData({ ...data, [name]: val });
  };

  const topLevelFields = schema.filter((f) => f.type !== 'array');
  const arrayFields = schema.filter((f) => f.type === 'array');

  return (
    <>
      <div className="form-grid" style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {topLevelFields.map((field) => (
          <div key={field.name} style={{ gridColumn: `span ${field.colSpan || 1}` }}>
            <RenderField
              error={get(errors, field.name)}
              field={{ ...field, disabled: field.disabled || isViewMode }}
              value={data[field.name]}
              onChange={(val) => handleChange(field.name, val)}
            />
          </div>
        ))}
      </div>

      {arrayFields.map((field) => {
        const fieldValue = data[field.name];
        const safeValue = Array.isArray(fieldValue) ? (fieldValue as Data[]) : [];
        return (
          <RenderArrayField
            isViewMode={isViewMode}
            key={field.name}
            field={field as ArrayFieldSchema}
            value={safeValue}
            onChange={(val) => handleChange(field.name, val)}
            errors={errors}
          />
        );
      })}
    </>
  );
}

export default DynamicForm;
