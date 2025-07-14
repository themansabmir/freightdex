import { IContainer } from '@modules/mbl/index.types';

export interface IShippingBill {
  shipping_bill_number: string;
  shipping_bill_date: string;
}

export interface IBillOfEntry {
  bill_of_entry_number: string;
  bill_of_entry_date: string;
}

export interface IHbl {
  shipping_bill: IShippingBill[];
  hbl_number: string;
  description: string;
  containers: IContainer[];
  bill_of_entry: IBillOfEntry[];
  [key: string]: any;
}
