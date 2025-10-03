import { api } from "@api/config";

const INVOICEITEM_ENDPOINT = '/invoiceitem';

export class InvoiceItemHttpService {
    public static async getInvoiceItemById(id: string) {
        const { data } = await api.get(`${INVOICEITEM_ENDPOINT}/${id}`);
        return data.response;
    }

    public static async getAllInvoiceItems() {
        const { data } = await api.get(INVOICEITEM_ENDPOINT);
        return data.response;
    }

    public static async saveInvoiceItem(invoiceItemBody: unknown) {
        const { data } = await api.post(INVOICEITEM_ENDPOINT, invoiceItemBody);
        return data.response;
    }
}
