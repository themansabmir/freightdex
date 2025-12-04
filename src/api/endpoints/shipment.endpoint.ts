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
    return data.response;
  }

  static async getAllDocumentsByShipmentId(id: string) {
    const { data } = await api.get(`${SHIPMENT_BASE_URL}/documents/${id}`);
    return data.response;
  }

  // Document upload method - integrated with backend
  static async uploadDocuments(shipmentId: string, files: FormData) {
    const { data } = await api.post(`/file/upload/${shipmentId}`, files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  }

  static async deleteDocument(documentId: string) {
    const { data } = await api.delete(`/file/${documentId}`);
    return data.data;
  }

  static async downloadDocument(documentId: string) {
    // Get file metadata first
    const { data } = await api.get(`/file/${documentId}`);
    return data.data;
  }

  static async getFilesByShipmentId(shipmentId: string) {
    // Get all files for a shipment
    const { data } = await api.get(`/file/shipment/${shipmentId}`);
    return data.data;
  }
}
