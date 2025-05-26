import { api } from '@api/config';
import { IUser } from '@modules/auth/index.types';

export type ApiResponse<T> = {
  message: string;
  response: T;
};

export class AuthHttpService {
  static async login(loginPayload: { email: string; password: string }) {
    const {
      data: { response, message },
    } = await api.post<ApiResponse<IUser>>('/login', loginPayload);
    return { response, message };
  }
}
