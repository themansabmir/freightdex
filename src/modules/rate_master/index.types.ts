export type CONTAINER_TYPE = 'HAZARDOUS' | 'REEFER' | 'GENERAL';
export type CONTAINER_SIZE = '20' | '40';
export type TRADE_TYPE = 'EXPORT' | 'IMPORT';


export interface ShippingLine {
    _id: string;
    vendor_name: string;
    vendor_code: string;
}
export interface Port {
    _id: string;
    port_name: string;
    port_code: string;
}
export interface ISheetRow {
    SHIPPING_LINE: ShippingLine;
    CONTAINER_TYPE: CONTAINER_TYPE;
    CONTAINER_SIZE: CONTAINER_SIZE;
    START_PORT: Port;
    END_PORT: Port;
    CHARGE_NAME: string;
    HSN_CODE: string;
    PRICE: number;
    EFFECTIVE_FROM: Date;
    EFFECTIVE_TO: Date;
    TRADE_TYPE: TRADE_TYPE;
}
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

export interface IDisplayRow {
    SHIPPING_LINE: string;
    START_PORT: string;
    END_PORT: string;
    CONTAINER_TYPE: CONTAINER_TYPE;
    CONTAINER_SIZE: CONTAINER_SIZE;
    TRADE_TYPE: TRADE_TYPE;
    EFFECTIVE_FROM: string;
    EFFECTIVE_TO: string | null;
    CHARGE_NAME: string;
    HSN_CODE: string;
    PRICE: number;
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
    shippingLineId?: string;
    containerType?: string;
    containerSize?: string;
    startPortId?: string;
    endPortId?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
    tradeType?: string;
}

export interface IDistinctShippingLine {
    _id: string;
    vendor_name: string;
}

export interface IDistinctPort {
    _id: string;
    port_name: string;
}

