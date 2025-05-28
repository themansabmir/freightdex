import { z } from 'zod';

export interface IPort {
  _id: string;
  port_name: string;
  port_code: string;
}

export interface PortGetAllParams {
  skip: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}
export enum EPort {
  port_name = 'port_name',
  port_code = 'port_code',
}

export type CreatePortRequest = Partial<IPort>;
export type UpdatePortRequest = Partial<IPort>;
export type GetAllPortResponse = {
  response: IPort[];
  total: number;
};

// Main vendor schema
export const portSchema = z.object({
  port_name: z.string().min(1, 'port name is required'),
  port_code: z.string().min(1, 'port code is required'),
  id: z.string().optional(),
});
