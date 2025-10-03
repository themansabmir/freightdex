
export type UNIT = 'container' | 'bl' | 'wm';

export interface FormValues {
    _id?: string;
    hsn_code: string;
    fieldName: string;
    gst: number | string;
    unit: UNIT;
    [key: string]: unknown
}