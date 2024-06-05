import { Role } from '../../common';

export interface ICreateUser {
  username: string;
  password: string;
  role: Role;
}
