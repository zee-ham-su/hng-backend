import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup() {
    return { message: 'Hello world' };
  }
  @Post('login')
  signin() {
    return 'i am login';
  }
}
