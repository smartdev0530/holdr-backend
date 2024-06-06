import { Role } from '../../common';

export class CreateUserDto {
  username: string;
  digest: string;
  role: Role;
}
