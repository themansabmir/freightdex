import { api } from '@api/config';
import { GetAllParams } from './vendor.endpoint';
import { buildUrlWithSearchParams } from '@shared/utils';
import { ITeam } from '@modules/team/index.types';

export class TeamHttpService {
  static async getAll(queryParams?: GetAllParams): Promise<{ response: ITeam[]; total: number }> {
    const finalUlr = buildUrlWithSearchParams('/team', queryParams);
    const { data } = await api.get(finalUlr);
    return { response: data.response, total: data.total };
  }

  static async create(payload: ITeam): Promise<ITeam> {
    const { data } = await api.post('/sign-up', payload);
    return data.message;
  }

  static async update(id: string, payload: Partial<ITeam>): Promise<ITeam> {
    const { data } = await api.put(`/team/${id}`, payload);
    return data.response;
  }

  static async delete(id: string): Promise<ITeam> {
    const { data } = await api.delete(`/team/${id}`);
    return data.response;
  }
}
