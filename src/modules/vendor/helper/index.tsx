import { IVendor, VendorType } from '@modules/vendor/index.types';

export const filterVendors = (data: IVendor[], vendor_type: VendorType) => {
  return data.filter((sl) => sl.vendor_type.includes(vendor_type));
};

export const formatShippingLines = (data: IVendor[]) => {
  return data
    .filter((sl) => sl.vendor_type.includes('shipping_line'))
    .map((item) => {
      return {
        label: item.vendor_name,
        value: item._id,
      };
    });
};

export const formatVendorLabel =(data:IVendor[]) =>{
  return  data.flatMap((item) => {
    return item.locations.map((it) => {
      return {
        label: `${item.vendor_name} - ${it.address}, ${it.city}, ${it.pin_code}`,
        value: `${item._id}|${it._id}`,
      };
    });
  }); 
}

export const formatVendors = (data: IVendor[], vendor_type: VendorType) => {
  const filtered = filterVendors(data, vendor_type);
  if (filtered.length === 0) {
    return [];
  }
  const result = formatVendorLabel(filtered)
  return result
}
