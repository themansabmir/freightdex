import { z } from "zod";
import { UNIT } from "../index.types";
import { FieldSchema } from "@generator/form/index.types";

export     const breadcrumbArray = [
    { label: 'Dashboard', href: '/' },
    { label: 'Invoice Item', href: '' },
];
export const gst_options = [
    { label: "0%", value: "0" },
    { label: "Exempted", value: "Exempted" },
    { label: "5%", value: "5" },
    { label: "12%", value: "12" },
    { label: "18%", value: "18" },
    { label: "28%", value: "28" }
]

export const defaultFormData = {
    hsn_code: '',
    fieldName: '',
    gst: "0",
    unit: 'container' as UNIT,
    _id: ''
}

export const validationSchema = {
    hsn_code: z.string().min(1, 'HSN Code is required'),
    fieldName: z.string().min(1, 'Field name is required'),
    gst: z.string().min(1, 'GST is required'),
    unit: z.enum(['container', 'bl', 'wm'])
}

export const formSchema: FieldSchema[] = [
    {
        type: 'text',
        name: 'hsn_code',
        label: 'HSN Code',
        placeholder: 'Enter HSN Code',
        required: true,
        colSpan: 1
    },
    {
        type: 'text',
        name: 'fieldName',
        label: 'Service Name',
        placeholder: 'Enter service name',
        required: true,
        colSpan: 2
    },
    {
        type: 'dropdown',
        name: 'gst',
        label: 'GST',
        placeholder: 'Select GST',
        required: true,
        options: gst_options,
        colSpan: 1
    },
    {
        type: 'dropdown',
        name: 'unit',
        label: 'Unit',
        placeholder: 'Select unit',
        required: true,
        options: [
            { label: 'CONTAINER', value: 'container' },
            { label: 'BL', value: 'bl' },
            { label: "W/M", value: "wm" }
        ],
        colSpan: 1
    }
];