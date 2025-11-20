import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    console.log('🔹 Intento de login:', { username, password });
  
    const user = await this.usersService.findByUsername(username);
    console.log('🔹 Usuario encontrado en BD:', user);
  
    if (!user) {
      console.log(' Usuario no existe');
      return null;
    }
  
    const match = await bcrypt.compare(password, user.password);
    console.log('🔹 Coincide contraseña?', match);
  
    if (!match) {
      console.log(' Contraseña incorrecta');
      return null;
    }
  
    const { password: _, ...safe } = user;
    console.log('✅ Login OK, usuario seguro:', safe);
    return safe;
  }
  

  async login(user: any) {
    const accessToken = this.jwtService.sign(
      {
        username: user.username,
        sub: user.id,
        role: user.role,
      },
      { expiresIn: '1h' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d', secret: 'refresh-secret' },
    );

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'refresh-secret',
      });

      const user = await this.usersService.getUserByRefreshToken(refreshToken);
      if (!user) throw new UnauthorizedException();

      const newAccess = this.jwtService.sign(
        {
          username: user.username,
          sub: user.id,
          role: user.role,
        },
        { expiresIn: '1h' },
      );

      return { access_token: newAccess };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(id: number) {
    await this.usersService.setRefreshToken(id, null);
    return { message: 'Sesión cerrada' };
  }
}

