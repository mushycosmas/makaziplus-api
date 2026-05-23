import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =====================
  // REGISTER USER
  // =====================
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  // =====================
  // LOGIN USER
  // =====================
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}