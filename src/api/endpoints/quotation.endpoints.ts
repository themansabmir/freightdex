// src/api/endpoints/quotation.endpoints.ts
import { api } from '@api/config';
import { GetAllQuotationResponse, IQuotation, QuotationGetAllParams } from '@modules/quotation/index.types';

interface FilterOption {
  label: string;
  value: string;
}

export interface QuotationFilterOptions {
  statuses: FilterOption[];
  customers: FilterOption[];
  shippingLines: FilterOption[];
  startPorts: FilterOption[];
  endPorts: FilterOption[];
}

export class QuotationHttpService {
  static async create(payload: Partial<IQuotation>): Promise<IQuotation> {
    const { data } = await api.post('/quotation', payload);
    return data.response ?? data;
  }

  static async getFilterOptions(): Promise<QuotationFilterOptions> {
    const { data } = await api.get('/quotation/filter-options');
    return data;
  }

  static async getAll(queryParams: QuotationGetAllParams): Promise<GetAllQuotationResponse> {
    const { limit, search, skip, sortBy, sortOrder, status, customerId, shippingLineId, startPortId, endPortId } = queryParams;

    const baseUrl = '/quotation';
    const params = new URLSearchParams({});

    if (limit) {
      const page = Number(skip ?? '0') + 1;
      params.append('page', String(page));
      params.append('limit', limit);
    }
    if (sortBy && sortOrder) {
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
    }
    if (search.trim()) {
      params.append('search', search);
    }
    if (status) {
      params.append('status', status);
    }
    if (customerId) {
      params.append('customerId', customerId);
    }
    if (shippingLineId) {
      params.append('shippingLineId', shippingLineId);
    }
    if (startPortId) {
      params.append('startPortId', startPortId);
    }
    if (endPortId) {
      params.append('endPortId', endPortId);
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;
    const { data } = await api.get(fullUrl);
    const response = (data.response ?? data.quotations ?? data) as IQuotation[];
    return {
      response,
      total: data.total ?? data.count ?? response.length,
    };
  }

  static async update(id?: string, payload?: Partial<IQuotation>): Promise<IQuotation> {
    const { data } = await api.put(`/quotation/${id}`, payload);
    return data.response ?? data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/quotation/${id}`);
  }

  static async updateStatus(id: string, status: string): Promise<IQuotation> {
    const { data } = await api.patch(`/quotation/${id}/status`, { status });
    return data.response ?? data;
  }

  static async downloadPDF(id: string): Promise<void> {
    const response = await api.get(`/quotation/${id}/pdf`, {
      responseType: 'blob',
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotation-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  static async sendToVendor(id: string): Promise<{ message: string }> {
    const { data } = await api.post(`/quotation/${id}/send-to-vendor`);
    return data;
  }
}
