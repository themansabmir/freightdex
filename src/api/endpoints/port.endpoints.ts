import { api } from '@api/config';
import { CreatePortRequest, GetAllPortResponse, IPort, UpdatePortRequest } from '@modules/port/index.types';

interface PortGetAllParams  {
  skip: string,
  limit: string,
  search: string,
  sortBy: string,
  sortOrder: string,
}
export class PortHttpService {
  static async create(payload: CreatePortRequest): Promise<IPort> {
    const { data } = await api.post('/port', payload);
    return data.response;
  }

  static async getAll(queryParams: PortGetAllParams): Promise<GetAllPortResponse> {
    const {limit ,search,skip,sortBy,sortOrder }= queryParams
    const baseUrl = '/port';
    const params = new URLSearchParams({})
    if (limit ) {
      params.append("limit", limit)
      params.append("skip", skip)
    }
    if (sortBy && sortOrder) {
      params.append("sortBy", sortBy)
      params.append("sortOrder",sortOrder)
    }
    if (search.trim()) {
      params.append("search", search)
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;
    const { data } = await api.get(fullUrl);
    return {
      response: data.response,
      total: data?.total,
    };
  }

  static async getById(id: string) {
    const { data } = await api.get(`/port/${id}`);
    return data.response;
  }

  static async update(id?: string, payload?: UpdatePortRequest) {
    const { data } = await api.put(`/port/${id}`, payload);
    return data.response;
  }

  static async delete(id: string) {
    const { data } = await api.delete(`/port/${id}`);
    return data.response;
  }
}
