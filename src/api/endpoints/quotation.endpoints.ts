// src/api/endpoints/quotation.endpoints.ts
import { api } from '@api/config';
import { GetAllQuotationResponse, IQuotation, QuotationGetAllParams } from '@modules/quotation/index.types';

export class QuotationHttpService {
  static async create(payload: Partial<IQuotation>): Promise<IQuotation> {
    const { data } = await api.post('/quotation', payload);
    return data.response ?? data;
  }

  static async getAll(queryParams: QuotationGetAllParams): Promise<GetAllQuotationResponse> {
    const { limit, search, skip, sortBy, sortOrder } = queryParams;

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
}
