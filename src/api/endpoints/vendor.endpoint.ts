import { api } from '@api/config';
import { CreateVendorRequest, GetAllVendorResponse, IVendor, UpdateVendorRequest } from '@modules/vendor/index.types';

export class VendorHttpService {
  static async create(payload: CreateVendorRequest): Promise<IVendor> {
    const { data} = await api.post('/vendor', payload);
    return data.response;
  }

  static async getAll(queryString?: string): Promise<GetAllVendorResponse> {
    let url = '/vendor';
    if (queryString) {
      url = url + queryString;
    }
    const { data } = await api.get(url);
    console.log(data.response);
    return {
      response: data.response.data,
      total: data?.response?.total,
    };
  }

  static async getById(id: string) {
    const { data } = await api.get(`/vendor/${id}`);
    return data.response;
  }

  static async update(id: string, payload: UpdateVendorRequest) {
    const { data } = await api.put(`/vendor/${id}`, payload);
    return data.response;
  }

  static async delete(id: string) {
    const { data } = await api.delete(`/vendor/${id}`);
    return data.response;
  }
}
