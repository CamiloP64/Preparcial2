import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  username: string;
  password: string;
  role: UserRole;
}
