import { z } from 'zod';

export interface IAirport {
  _id: string;
  airport_name: string;
  airport_code: string;
  [key: string]: unknown;
}

export interface AirportGetAllParams {
  skip: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}

export enum EAirport {
  airport_name = 'airport_name',
  airport_code = 'airport_code',
}

export type CreateAirportRequest = Partial<IAirport>;
export type UpdateAirportRequest = Partial<IAirport>;
export type GetAllAirportResponse = {
  response: IAirport[];
  total: number;
};

export const airportSchema = z.object({
  airport_name: z.string().min(1, 'Airport name is required'),
  airport_code: z.string().min(1, 'Airport code is required'),
});
