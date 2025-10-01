import { useState } from 'react';
import PageHeader from "@blocks/page-header"
import PageLoader from "@shared/components/Loader/PageLoader"
import DynamicForm from '@generator/form';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { Button, Typography } from '@shared/components';
import { z } from 'zod';
import { Modal } from '@shared/components/Modal';
import { useModal } from '@shared/hooks/useModa';
import { Stack } from '@shared/components/Stack';
import ServiceItemRow from '@shared/components/ItemRow';

const gst_options = [
    { label: "0%", value: 0 },
    { label: "Exempted", value: "Exempted" },
    { label: "5%", value: 5 },
    { label: "12%", value: 12 },
    { label: "18%", value: 18 },
    { label: "28%", value: 28 }
]


type UNIT = 'container' | 'bl' | 'wm';

interface FormValues {
    id?: string;
    hsn_code: string;
    fieldName: string;
    gst: number | string;
    unit: UNIT;
}

const InvoiceItem = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const [serviceList, setServiceList] = useState<FormValues[]>([
        {
            "id": "1",
            "hsn_code": "2001",
            "fieldName": "Steel Container",
            "gst": 18,
            "unit": "container"
        },
        {
            "id": "2",
            "hsn_code": "2002",
            "fieldName": "Plastic Container",
            "gst": "12",
            "unit": "container"
        },
        {
            "id": "3",
            "hsn_code": "2003",
            "fieldName": "Bulk Liquid",
            "gst": 5,
            "unit": "bl"
        },
        {
            "id": "4",
            "hsn_code": "2004",
            "fieldName": "Bulk Powder",
            "gst": "18",
            "unit": "bl"
        },
        {
            "id": "5",
            "hsn_code": "2005",
            "fieldName": "Water Meter",
            "gst": 12,
            "unit": "wm"
        },
        {
            "id": "6",
            "hsn_code": "2006",
            "fieldName": "Smart Water Meter",
            "gst": "18",
            "unit": "wm"
        },
        {
            "id": "7",
            "hsn_code": "2007",
            "fieldName": "Chemical Container",
            "gst": 28,
            "unit": "container"
        },
        {
            "id": "8",
            "hsn_code": "2008",
            "fieldName": "Edible Oil Bulk",
            "gst": "5",
            "unit": "bl"
        },
        {
            "id": "9",
            "hsn_code": "2009",
            "fieldName": "Digital Water Meter",
            "gst": 18,
            "unit": "wm"
        },
        {
            "id": "10",
            "hsn_code": "2010",
            "fieldName": "Industrial Container",
            "gst": "12",
            "unit": "container"
        }
    ]
)
    const [formData, setFormData] = useState<FormValues>({
        hsn_code: '',
        fieldName: '',
        gst: 0,
        unit: 'container'
    });

    const { handleChange, errors } = useFormValidation<FormValues>(
        z.object({
            hsn_code: z.string().min(1, 'HSN Code is required'),
            fieldName: z.string().min(1, 'Field name is required'),
            gst: z.number().min(1, 'GST is required'),
            unit: z.enum(['container', 'bl', 'wm'])
        }),
        formData
    );

    const isLoading = false;
    const breadcrumbArray = [
        { label: 'Dashboard', href: '/' },
        { label: 'Invoice Item', href: '' },
    ];


    const formSchema = [
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
        // 0, 5, 12, 18 , 28
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

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission here
        closeModal();
    };

    return (
        <div>
            <PageLoader isLoading={isLoading} />
            <PageHeader
                pageName="Service Item"
                pageDescription="Here you can manage your invoice service item form field & types"
                isEdit={false}
                isViewMode={false}
                isForm={isOpen}
                breadcrumnArray={breadcrumbArray}
            />

            <Stack direction='horizontal' justify='end'>
                <Button onClick={() => openModal()} addClass='flex'>+ Add New Service</Button>
            </Stack>

            <Modal isOpen={isOpen} onClose={() => {
                closeModal()
                setFormData({
                    hsn_code: '',
                    fieldName: '',
                    gst: 0,
                    unit: 'container'
                })
            }} size='lg'>
                <Modal.Header>
                    <Typography variant="display-xs" weight='bold' transform='capitalize' addClass="ml-2">
                        Service Item
                    </Typography>
                </Modal.Header>
                <Modal.Body>
                    <div className='ml-10 py-5'>
                        <div >
                            <DynamicForm
                                schema={formSchema}
                                data={formData}
                                setData={setFormData}
                                onChange={handleChange}
                                isViewMode={false}
                                errors={errors}
                            />
                            <div style={{ marginTop: '16px' }}>

                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Stack direction="horizontal" gap="1em" justify='end' className='mr-4'>
                        <Button variant='destructive' onClick={() => closeModal()}>Close</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Stack>
                </Modal.Footer>

            </Modal>

            {
                serviceList.map((item, index) => (
                    <ServiceItemRow
                        key={index}
                        item={item}
                        onEdit={(row: any) => {
                            setFormData(row)
                            openModal()
                        }
                        }
                        onDelete={(id: string | number) => {
                            openModal()

                        }
                        }
                        className="service-item-row"
                    />
                ))
            }
        </div>
    )
}

export default InvoiceItem