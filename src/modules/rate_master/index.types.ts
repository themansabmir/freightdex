export type CONTAINER_TYPE = 'HAZARDOUS' | 'REEFER' | 'GENERAL';
export type CONTAINER_SIZE = '20' | '40';
export type TRADE_TYPE = 'EXPORT' | 'IMPORT';


export interface IExcelRow {
    shippingLineId: string;
    startPortId: string;
    endPortId: string;
    containerType: CONTAINER_TYPE;
    containerSize: CONTAINER_SIZE;
    tradeType: TRADE_TYPE;
    effectiveFrom: Date;
    effectiveTo?: Date;
    chargeName: string;
    hsnCode: string;
    price: number;
    currency: string;
}

export interface IRateSheetMaster {
    _id: string;
    comboKey: string;
    shippingLineId: string;
    startPortId: string;
    endPortId: string;
    containerType: CONTAINER_TYPE;
    containerSize: CONTAINER_SIZE;
    tradeType: TRADE_TYPE;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICharge {
    _id: string;
    rateSheetMasterId: String;
    chargeName: string;
    hsnCode?: string;
    currency: string;
    price: number;
    effectiveFrom: Date;
    effectiveTo?: Date;
    createdAt: Date;
    updatedAt: Date;
}


export interface GetRateSheetsFilters {
    shippingLineId: string;
    containerType?: string;
    containerSize?: string;
    startPortId?: string;
    endPortId?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
    tradeType?: string;
}

