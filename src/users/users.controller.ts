import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const { password, ...rest } = user;
    return rest;
  }

  @Roles('admin')
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id); 
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(+id, dto); 
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }

  @Roles('admin', 'user')
  @Get('me/profile')
  async myProfile(@Request() req) {
    const userId = req.user.id;
    return await this.usersService.findOne(userId);
  }
}
