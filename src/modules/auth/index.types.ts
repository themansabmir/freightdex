type ROLE = 'editor' | 'admin';
export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: ROLE;
  permissions: string[];
    access_token: string;
    is_active: boolean;
}
export interface LoginResponse {
  message: string;
  response: IUser;
}

export type LoginPayload = {
  email: string;
  password: string;
};


export interface MenuOptions {
  btnName: string,
  onClick: () => void
  icon: React.ReactNode

}