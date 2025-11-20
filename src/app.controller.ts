import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected() {
    return { message: 'Ruta protegida OK' };
  }

  // 👇 Aquí combinamos JWT + RolesGuard
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin')
  adminRoute(@Request() req) {
    return {
      message: 'Solo admin puede acceder',
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  @Get('dashboard')
  dashboard(@Request() req) {
    return {
      message: 'Admin o user pueden acceder',
      user: req.user,
    };
  }
}




