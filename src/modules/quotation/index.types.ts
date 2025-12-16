// src/modules/quotation/index.types.ts
export enum EQuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  // EXPIRED = 'EXPIRED',
  // DELETED = 'DELETED',
}

export interface IQuotationLineItem {
  _id?: string;
  quotationId: string;
  chargeName: string;
  hsnCode: string;
  price: number;
  currency: string;
  quantity: number;
  totalAmount: number;
}

export interface IQuotation {
  _id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingLineId: string;
  startPortId: string;
  endPortId: string;
  containerType: string;
  containerSize: string;
  tradeType: string;
  validFrom: string;
  validTo: string;
  status: EQuotationStatus;
  lineItems?: IQuotationLineItem[];
  createdAt: string;
  updatedAt: string;
  temp?: boolean;
}

export interface GetAllQuotationResponse {
  response: IQuotation[];
  total: number;
}

export interface QuotationGetAllParams {
  skip: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
  status?: string;
  [key: string]: unknown;
}
