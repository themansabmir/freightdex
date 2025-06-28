import { z } from 'zod';

export type VendorType = 'shipper' | 'consignee' | 'shipping_line' | 'freight_forwarder' | 'agent' | 'cha' |'notify' | 'second_notify';
export interface IVendor {
  _id: string;
  vendor_name: string;
  vendor_type: VendorType[];
  locations: Array<{
    _id: string;
    city: string;
    pin_code: string;
    country: string;
    address: string;
    state: string;
    telephone: string;
    mobile_number: string;
    gst_number: string;
    pan_number: string;
    fax: string;
  }>;
  [key: string]: unknown;
}

export interface VendorGetAllParams {
  skip: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
  [key: string]: unknown;
}
export enum EVendor {
  vendor_name = 'vendor_name',
  vendor_type = 'vendor_type',
  city = 'city',
  state = 'state',
  address = 'address',
  pin_code = 'pin_code',
  country = 'country',
  telephone = 'telephone',
  mobile_number = 'mobile_number',
  gst_number = 'gst_number',
  pan_number = 'pan_number',
  fax = 'fax',
}

export type CreateVendorRequest = Partial<IVendor>;
export type UpdateVendorRequest = Partial<IVendor>;
export type GetAllVendorResponse = {
  response: IVendor[];
  total: number;
};

// Enum definition

export const VendorTypeEnum = ['cha', 'agent', 'shipper', 'consignee', 'shipping_line', 'freight_forwarder', 'notify', 'second_notify'] as const;

export const VendorType = z.enum(VendorTypeEnum);

// Location schema with non-empty strings
export const vendorLocationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  pan_number: z.string().min(1, 'PAN number is required'),
  address: z.string().min(1, 'Address is required'),
  gst_number: z.string().min(1, 'GST number is required'),
  fax: z.string(),
  mobile_number: z.string().min(1, 'Mobile number is required'),
  pin_code: z.string().min(1, 'PIN code is required'),
  telephone: z.string().min(1, 'Telephone is required'),
});

// Main vendor schema
export const vendorSchema = z.object({
  vendor_name: z.string().min(1, 'Vendor name is required'),
  vendor_type: z.array(VendorType).min(1, 'At least one vendor type must be selected'),
  id: z.string().optional(),
  locations: z.array(vendorLocationSchema).min(1, 'At least one location is required'),
});
