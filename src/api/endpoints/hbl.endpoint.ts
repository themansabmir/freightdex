import { API_CONFIG } from '../config';
import { BaseHttpService } from '../config/base-http.service'; // Assuming you have a base service

// Assuming IHbl is imported from where it's defined
import { IHbl } from '@modules/hbl/index.types';

const { API_URL } = API_CONFIG;
const HBL_BASE_URL = `${API_URL}/hbl`; // Example endpoint, adjust as per your API structure

interface HblSavePayload extends Omit<IHbl, 'created_at' | 'updated_at' | 'created_by'> {
  // any specific transformation for payload if needed
}


export const HblHttpService = {
  saveHBL: async (payload: HblSavePayload): Promise<IHbl> => {
    if (payload._id) { // Assuming _id is used for updates
      return BaseHttpService.put<IHbl>(`${HBL_BASE_URL}/${payload._id}`, payload);
    }
    return BaseHttpService.post<IHbl>(HBL_BASE_URL, payload);
  },

  // Get all HBLs for a specific MBL
  getHblsByMblId: async (mblId: string): Promise<IHbl[]> => {
    return BaseHttpService.get<IHbl[]>(`${HBL_BASE_URL}/by-mbl/${mblId}`);
  },

  // Get a single HBL by its own ID
  getHblById: async (hblId: string): Promise<IHbl> => {
    return BaseHttpService.get<IHbl>(`${HBL_BASE_URL}/${hblId}`);
  },

  // Delete an HBL by its ID
  deleteHBL: async (hblId: string): Promise<void> => { // Or whatever your API returns on delete
    return BaseHttpService.delete<void>(`${HBL_BASE_URL}/${hblId}`);
  },

  // If HBLs are directly linked to shipment folders as well
  getHblsByShipmentFolderId: async (shipmentFolderId: string): Promise<IHbl[]> => {
    return BaseHttpService.get<IHbl[]>(`${HBL_BASE_URL}/by-shipment-folder/${shipmentFolderId}`);
  }
};

// Ensure BaseHttpService is correctly implemented with methods like get, post, put, delete.
// Example BaseHttpService structure (simplified):
/*
class BaseHttpService {
  static async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  static get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  static post<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
  // Add put, delete etc.
}
*/
