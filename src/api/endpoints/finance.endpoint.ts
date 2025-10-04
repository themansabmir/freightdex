import { api } from '@api/config';

export interface GetAllParams {
  skip: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
  [key: string]: unknown;
}

export interface ILineItem {
  serviceItem: string;
  hsn?: string;
  rate: number;
  currency: string;
  unit?: string;
  exchangeRate: number;
  quantity: number;
  pricePerUnit: number;
  discount: number;
  taxableAmount: number;
  gstPercent: number;
  gstAmount: number;
  totalWithGst: number;
}

export interface IFinanceDocument {
  _id?: string;
  shipmentId: {shipment_name: string};
  customerId: {vendor_name: string};
  type: 'proforma' | 'invoice' | 'credit_note';
  status: 'draft' | 'sent' | 'acknowledged' | 'paid' | 'issued' | 'cancelled';
  parentDocumentId?: string;
  documentNumber: string;
  issueDate: string;
  dueDate?: string;
  lineItems: ILineItem[];
  currency: string;
  // Updated field names to match backend
  net_discount: number;
  net_taxable: number;
  net_gst: number;
  grand_total: number;
  acknowledgedAt?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllFinanceResponse {
  response: IFinanceDocument[];
  total: number;
}

const FINANCE_ENDPOINT = '/finance';

export class FinanceHttpService {
  static async create(payload: Partial<IFinanceDocument>): Promise<IFinanceDocument> {
    const { data } = await api.post(FINANCE_ENDPOINT, payload);
    return data.response;
  }

  static async getAll(queryParams: GetAllParams): Promise<GetAllFinanceResponse> {
    const { limit, search, skip, sortBy, sortOrder } = queryParams;
    const baseUrl = FINANCE_ENDPOINT;
    const params = new URLSearchParams({});
    
    if (limit) {
      params.append('limit', limit);
      params.append('skip', skip);
    }
    if (sortBy && sortOrder) {
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
    }
    if (search.trim()) {
      params.append('search', search);
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;
    const { data } = await api.get(fullUrl);
    return {
      response: data.response,
      total: data?.total,
    };
  }

  static async getById(id: string): Promise<IFinanceDocument> {
    const { data } = await api.get(`${FINANCE_ENDPOINT}/${id}`);
    return data.response;
  }

  static async update(id: string, payload: Partial<IFinanceDocument>): Promise<IFinanceDocument> {
    const { data } = await api.put(`${FINANCE_ENDPOINT}/${id}`, payload);
    return data.response;
  }

  static async delete(id: string): Promise<void> {
    const { data } = await api.delete(`${FINANCE_ENDPOINT}/${id}`);
    return data.response;
  }

  static async getByShipment(shipmentId: string): Promise<IFinanceDocument[]> {
    const { data } = await api.get(`${FINANCE_ENDPOINT}/shipment/${shipmentId}`);
    return data.response;
  }

  static async getByCustomer(customerId: string): Promise<IFinanceDocument[]> {
    const { data } = await api.get(`${FINANCE_ENDPOINT}/customer/${customerId}`);
    return data.response;
  }
}