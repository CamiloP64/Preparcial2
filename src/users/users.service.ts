import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepo.find();
    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  // 👇 ESTE ES EL QUE USA EL LOGIN
  async findByUsername(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const newUser = this.usersRepo.create({
      username: dto.username,
      password: hashed,
      role: dto.role,
    });

    return this.usersRepo.save(newUser);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) return null;

    if (dto.username) user.username = dto.username;
    if (dto.role) user.role = dto.role;
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const saved = await this.usersRepo.save(user);
    const { password, ...rest } = saved;
    return rest;
  }

  async remove(id: number) {
    const result = await this.usersRepo.delete(id);
    return !!result.affected;
  }

  async setRefreshToken(id: number, token: string | null) {
    await this.usersRepo.update(id, { refreshToken: token });
  }

  async getUserByRefreshToken(token: string) {
    return this.usersRepo.findOne({ where: { refreshToken: token } });
  }
}


