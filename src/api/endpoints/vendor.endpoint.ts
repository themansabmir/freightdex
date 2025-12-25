import { api } from '@api/config';
import { CreateVendorRequest, GetAllVendorResponse, IVendor, UpdateVendorRequest } from '@modules/vendor/index.types';

export interface GetAllParams {
  skip: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
  [key: string]: unknown;
}
export class VendorHttpService {
  static async create(payload: CreateVendorRequest): Promise<IVendor> {
    const { data } = await api.post('/vendor', payload);
    return data.response;
  }

  static async getAll(queryParams: GetAllParams): Promise<GetAllVendorResponse> {
    const { limit, search, skip, sortBy, sortOrder } = queryParams;
    const baseUrl = '/vendor';
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

  static async getById(id: string) {
    const { data } = await api.get(`/vendor/${id}`);
    return data.response;
  }

  static async update(id?: string, payload?: UpdateVendorRequest) {
    const { data } = await api.put(`/vendor/${id}`, payload);
    return data.response;
  }

  static async delete(id: string) {
    const { data } = await api.delete(`/vendor/${id}`);
    return data.response;
  }

  static async downloadTemplate() {
    const response = await api.get(`excel/template/vendor`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendor_template.xlsx';
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }

  static async bulkInsert(file: FormData) {
    const { data } = await api.post(`excel/bulk-insert/vendor`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.response;
  }
}
