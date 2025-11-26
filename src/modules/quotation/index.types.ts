export interface IQuotation {
    _id: string;
    quotationNumber: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    shippingLineId: string;
    startPortId: string;
    endPortId: string;
    containerType: string;
    containerSize: string;
    tradeType: string;
    validFrom: string;
    validTo: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface IQuotationLineItem {
    _id: string;
    quotationId: string;
    chargeName: string;
    hsnCode: string;
    price: number;
    currency: string;
    quantity: number;
    totalAmount: number;
}

export interface IQuotationFilters {
    customerId: string;
    shippingLineId: string;
    containerType: string;
    containerSize: string;
    startPortId: string;
    endPortId: string;
    tradeType: string;
    validFrom?: Date;
    validTo?: Date;
}
