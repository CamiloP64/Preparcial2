import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private roles: Role[] = [
    { id: 1, name: 'admin', description: 'Administrador del sistema' },
    { id: 2, name: 'user', description: 'Usuario estándar' },
  ];

  findAll(): Role[] {
    return this.roles;
  }

  findOne(id: number): Role | undefined {
    return this.roles.find((r) => r.id === id);
  }

  create(dto: CreateRoleDto): Role {
    const id = this.roles.length + 1;
    const role: Role = { id, ...dto };
    this.roles.push(role);
    return role;
  }

  update(id: number, dto: UpdateRoleDto): Role | undefined {
    const role = this.roles.find((r) => r.id === id);
    if (!role) return undefined;
    Object.assign(role, dto);
    return role;
  }

  remove(id: number): boolean {
    const index = this.roles.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.roles.splice(index, 1);
    return true;
  }
}

