import { api } from '@api/config';

const MBL_ENDPOINT = '/mbl';

export class MblHttpService {
    static async saveMBL(mblBody: unknown) {
    const { data } = await api.post(MBL_ENDPOINT, mblBody);
    return data.response;
  }

  static async getMblByFolderId(id: string) {
    const { data } = await api.get(`${MBL_ENDPOINT}/${id}`);
    return data.response;
  }
}
