import { Role } from './common';

export interface IUser {
  id: number;
  username: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
