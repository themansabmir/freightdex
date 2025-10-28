import { api } from '@api/config';
import { GetRateSheetsFilters, IExcelRow, ISheetRow, IDistinctShippingLine, IDistinctPort } from '@modules/rate_master/index.types';

const RATE_MASTER_ENDPOINT = '/rate-sheet';

export class RateMasterHttpService {


  static async downloadTemplate(moduleName: string) {
    try {
      const response = await api.get(
        `excel/template/${moduleName}`,
        {
          responseType: "blob", // 👈 tell Axios this is binary data
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rate-master.xlsx"; // Suggested filename
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      throw error
    }
  }

  static async getActiveRateSheets(filters: GetRateSheetsFilters): Promise<ISheetRow[]> {
    const params = new URLSearchParams();

    // Optional parameters - shippingLineId is now optional
    if (filters.shippingLineId) params.append('shippingLineId', filters.shippingLineId);
    if (filters.containerType) params.append('containerType', filters.containerType);
    if (filters.containerSize) params.append('containerSize', filters.containerSize);
    if (filters.startPortId) params.append('startPortId', filters.startPortId);
    if (filters.endPortId) params.append('endPortId', filters.endPortId);
    if (filters.effectiveFrom) {
      const dateStr = filters.effectiveFrom instanceof Date
        ? filters.effectiveFrom.toISOString()
        : filters.effectiveFrom;
        console.log("Datestr" , dateStr)
      params.append('effectiveFrom', dateStr);
    }
    if (filters.effectiveTo) {
      const dateStr = filters.effectiveTo instanceof Date
        ? filters.effectiveTo.toISOString()
        : filters.effectiveTo;
      params.append('effectiveTo', dateStr);
    }
    if (filters.tradeType) params.append('tradeType', filters.tradeType);

    const { data } = await api.get(`${RATE_MASTER_ENDPOINT}?${params.toString()}`);
    return data.response;
  }


  static async bulkInsertRateSheet(file: FormData): Promise<IExcelRow[]> {
    const { data } = await api.post(`excel/bulk-insert/rate-master`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.response;
  }

  static async getDynamicFilters(shippingLineId: string): Promise<{
    startPorts: Array<{ label: string; value: string; port_name: string; port_code: string }>;
    endPorts: Array<{ label: string; value: string; port_name: string; port_code: string }>;
    containerTypes: Array<{ label: string; value: string }>;
    containerSizes: Array<{ label: string; value: string }>;
    tradeTypes: Array<{ label: string; value: string }>;
  }> {
    const { data } = await api.get(`${RATE_MASTER_ENDPOINT}/filters/${shippingLineId}`);
    return data.response;
  }

  static async getDistinctShippingLines(): Promise<IDistinctShippingLine[]> {
    const { data } = await api.get(`${RATE_MASTER_ENDPOINT}/shippingLines`);
    return data.response;
  }

  static async getDistinctPorts(shippingLineId?: string): Promise<IDistinctPort[]> {
    const { data } = await api.get(`${RATE_MASTER_ENDPOINT}/distinctPorts?shippingLineId=${shippingLineId}`);
    return data.response;
  }
}
