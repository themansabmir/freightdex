type CommonFieldProps = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  colSpan?: number;
  placeholder?: string;
};

type TextField = CommonFieldProps & {
  type: 'text' | 'email' | 'password';
};

type DateField = CommonFieldProps & {
  type: 'date';
};

type TextAreaField = CommonFieldProps & {
  type: 'textarea';
};
type RadioField = CommonFieldProps & {
  type: 'radio';
  options: { label: string; value: string }[];
};

type CheckboxField = CommonFieldProps & {
  type: 'checkbox';
  options?: { label: string; value: string }[]; // optional for single checkbox
};

type MultiSelectField = CommonFieldProps & {
  type: 'multiselect';
  options: { label: string; value: string }[];
};

type Dropdown = CommonFieldProps & {
  type: 'dropdown';
  options: { label: string; value: string }[];
  placeholder: string;
};

type GroupField = {
  type: 'group';
  fields: FieldSchema[];
};

type ArrayField = CommonFieldProps & {
  type: 'array';
  item: GroupField;
};

export type FieldSchema = TextField | RadioField | CheckboxField | MultiSelectField | Dropdown | ArrayField | DateField | TextAreaField;

export interface GroupFieldSchema {
  type: 'group';
  fields: FieldSchema[];
}

export interface ArrayFieldSchema {
  label: string;
  type: 'array';
  name?: string;
  required?: boolean;
  item: {
    fields: FieldSchema[];
  };
}

export interface RenderFieldProps {
  field: FieldSchema;
  value: any;
  onChange: (val: any) => void;
  error: any;
}

export interface RenderGroupProps {
  fieldPathPrefix?: string;
  isViewMode?: boolean;
  fields: GroupFieldSchema['fields'];
  value: any;
  onChange: (val: any) => void;
  columns?: number;
  errors?: any;
}
export interface RenderArrayFieldProps {
  isViewMode?: boolean;
  errors?: any;
  field: ArrayFieldSchema;
  value: Data[];
  onChange: (val: unknown[]) => void;
}
export type Data = {
  [key: string]: string | number | boolean | string[] | Data[];
};

export interface DynamicFormProps<T extends Record<string, any>> {
  schema: FieldSchema[];
  isViewMode: boolean;
  data: T;
  onChange: (name: string, val: unknown) => void;
  errors: Partial<Record<keyof T, string>>;

  setData: React.Dispatch<React.SetStateAction<T>>;
}
