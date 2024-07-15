import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return { message: 'Hello world, i have logged in' };
  }

  signup() {
    return { message: 'Hello everyone, i have signup' };
  }
}
