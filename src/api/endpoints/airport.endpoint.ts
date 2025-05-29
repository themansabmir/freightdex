// import { api } from "@api/config";

// export const createAirport =async (airportBody) => {
//   try {
//     const { data } = await api.post("/airport", airportBody);
//     return data.response;
//   } catch (error) {
//     throw new Error("error");
//   }
// };
  import { api } from '@api/config';
import {
  CreateAirportRequest,
  GetAllAirportResponse,
  IAirport,
  UpdateAirportRequest,
} from '@modules/airport/index.types';

interface AirportGetAllParams {
  skip: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}

export class AirportHttpService {
  static async create(payload: CreateAirportRequest): Promise<IAirport> {
    const { data } = await api.post('/airport', payload);
    return data.response;
  }

  static async getAll(queryParams: AirportGetAllParams): Promise<GetAllAirportResponse> {
    const { limit, search, skip, sortBy, sortOrder } = queryParams;
    const baseUrl = '/airport';
    const params = new URLSearchParams();

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
      total: data.total,
    };
  }

  static async getById(id: string) {
    const { data } = await api.get(`/airport/${id}`);
    return data.response;
  }

  static async update(id?: string, payload?: UpdateAirportRequest) {
    const { data } = await api.put(`/airport/${id}`, payload);
    return data.response;
  }

  static async delete(id: string) {
    const { data } = await api.delete(`/airport/${id}`);
    return data.response;
  }
}

