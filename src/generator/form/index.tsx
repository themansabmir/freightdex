import { Button, Checkbox, TextField } from '@shared/components';
import MultiSelectInput from '@shared/components/Dropdown';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { DynamicFormProps, ArrayFieldSchema, RenderArrayFieldProps, RenderGroupProps, RenderFieldProps, Data } from './index.types';

function RenderField({ field, value, onChange }: RenderFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  if (['text', 'email', 'password'].includes(field.type)) {
    return <TextField value={value || ''} onChange={handleChange} {...field} />;
  }

  if (field.type === 'checkbox' && field.options) {
    const selected: string[] = value || [];
    const toggle = (val: string) => {
      const updated = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
      onChange(updated);
    };
    return (
      <div className="">
        <div className="" style={{ marginBottom: '8px' }}>
          {field.label}
        </div>
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
    const selected: string[] = value || [];
    const toggle = (val: string) => {
      const updated = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
      onChange(updated);
    };
    return (
      <MultiSelectInput
        label={field.label}
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

  return null;
}

function RenderGroup({ fields, value, onChange, isViewMode = false }: RenderGroupProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {fields.map((f) => (
        <RenderField field={{ ...f, disabled: isViewMode }} value={value?.[f.name]} onChange={(val) => onChange({ ...value, [f.name]: val })} />
      ))}
    </div>
  );
}

function RenderArrayField({ field, value = [], onChange, isViewMode }: RenderArrayFieldProps) {
  const addItem = () => onChange([...value, {}]);
  const removeItem = (idx: number) => {
    const updated = [...value];
    updated.splice(idx, 1);
    onChange(updated);
  };

  return (
    <div className="field__group">
      <h4>
        {field.label} {value.length > 0 && value.length}
      </h4>
      {value.map((itemVal, idx) => (
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
          />
          <button onClick={() => removeItem(idx)} className="field__wrapper">
            <Trash2 color="red" size={18} />
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button disabled={isViewMode} onClick={addItem}>
          + Add {field.label}
        </Button>
      </div>
    </div>
  );
}

function DynamicForm<T extends Record<string, unknown>>({ schema, data, setData, isViewMode = false }: DynamicFormProps<T>) {
  const handleChange = (name: string, val: unknown) => {
    setData({ ...data, [name]: val });
  };

  const topLevelFields = schema.filter((f) => f.type !== 'array');
  const arrayFields = schema.filter((f) => f.type === 'array');

  return (
    <>
      <div
        className="form-grid"
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {topLevelFields.map((field) => (
          <div key={field.name} style={{ gridColumn: `span ${field.colSpan || 1}` }}>
            <RenderField field={{ ...field, disabled: isViewMode }} value={data[field.name]} onChange={(val) => handleChange(field.name, val)} />
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
          />
        );
      })}
    </>
  );
}

export default DynamicForm;
