import { api } from '@api/config';

const HBL_ENDPOINT = '/hbl';

export class HBLHttpService {
  public static async getHblById(id: string) {
    if (id === 'new') return null;
    const { data } = await api.get(`${HBL_ENDPOINT}/${id}`);
    return data.response;
  }

  public static async getHblsByShipmentId(id: string) {
    if (id === 'new') return null;
    const { data } = await api.get(`${HBL_ENDPOINT}/shipment/${id}`);
    return data.response;
  }

  public static async saveHbl(hblBody: unknown) {
    const { data } = await api.post(HBL_ENDPOINT, hblBody);
    return data.response;
  }
}
