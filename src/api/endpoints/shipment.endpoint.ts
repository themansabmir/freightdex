import { api } from '@api/config';
import { GetAllParams } from './vendor.endpoint';

const SHIPMENT_BASE_URL = '/shipment';
export class ShipmentHttpService {
  static async createShipmentFolder(shipmentBody: { shipment_type: string }) {
    const { data } = await api.post(SHIPMENT_BASE_URL, shipmentBody);
    return data.response;
  }

  static async getFolderById(id: string) {
    if (id === 'new') return null;
    const { data } = await api.get(`${SHIPMENT_BASE_URL}/${id}`);
    return data.response;
  }

  static async getShipmentFolder(queryParams: GetAllParams) {
    const { limit, search, skip, sortBy, sortOrder, shipment_type } = queryParams;
    const params = new URLSearchParams({});
    if (shipment_type) {
      params.append('shipment_type', String(shipment_type));
    }
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

    const fullUrl = `${SHIPMENT_BASE_URL}?${params.toString()}`;
    const { data } = await api.get(fullUrl);

    //successResponse in backend returns { response, total, message }
    return {
      response: data.response ?? [],
      total: data.total ?? 0,
    };
  }

  static async getAllDocumentsByShipmentId(id: string) {
    const { data } = await api.get(`${SHIPMENT_BASE_URL}/documents/${id}`);
    return data.response;
  }
}
