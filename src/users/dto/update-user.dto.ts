import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  username?: string;
  password?: string;
  role?: UserRole;
}
