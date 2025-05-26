import { z } from 'zod';

export enum ETeam {
  USERNAME = 'username',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  EMAIL = 'email',
  ROLE = 'role',
  PERMISSIONS = 'permissions',
}

export const teamSchema =z.object({
  [ETeam.USERNAME]: z.string().min(3, 'Username is required'),
  [ETeam.FIRST_NAME]: z.string().min(3, 'First name is required'),
  [ETeam.LAST_NAME]: z.string().min(3, 'Last name is required'),
  [ETeam.EMAIL]: z.string().min(5, 'Email is required').email('Email is invalid'),
  [ETeam.ROLE]: z.string().min(1, 'Role is required'),
});
