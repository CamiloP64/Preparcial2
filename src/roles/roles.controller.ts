import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    NotFoundException,
  } from '@nestjs/common';
  import { RolesService } from './roles.service';
  import { CreateRoleDto } from './dto/create-role.dto';
  import { UpdateRoleDto } from './dto/update-role.dto';
  
  @Controller('roles')
  export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
  
    @Get()
    findAll() {
      return this.rolesService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      const role = this.rolesService.findOne(+id);
      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return role;
    }
  
    @Post()
    create(@Body() dto: CreateRoleDto) {
      return this.rolesService.create(dto);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
      const role = this.rolesService.update(+id, dto);
      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return role;
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      const ok = this.rolesService.remove(+id);
      if (!ok) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return { deleted: true };
    }
  }
  
  