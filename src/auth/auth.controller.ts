import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') token: string) {
    const result = await this.authService.refresh(token);
    if (!result) throw new UnauthorizedException('Invalid refresh token');
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}

