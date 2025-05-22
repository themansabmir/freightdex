export interface IVendor {
  id: string;
  _id: string;
  vendor_name: string;
  vendor_type: string[];
  locations: [
    {
      city: string;
      pin_code: string;
      country: string;
      address: string;
      state: string;
      telephone: string;
      mobile_number: string;
      gst_number: string;
      pan_number: string;
      fax: number;
    }
  ];
  [key: string]: unknown;
}

export enum EVendor {
  vendor_name = "vendor_name",
  vendor_type = "vendor_type",
  city = "city",
  state = "state",
  address = "address",
  pin_code = "pin_code",
  country = "country",
  telephone = "telephone",
  mobile_number = "mobile_number",
  gst_number = "gst_number",
  pan_number = "pan_number",
  fax = "fax",
}

export type CreateVendorRequest = Partial<IVendor>;
export type UpdateVendorRequest = Partial<IVendor>
export type GetAllVendorResponse = {
    response: IVendor[],
    total: number
}
