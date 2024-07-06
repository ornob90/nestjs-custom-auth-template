import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserRegisterDto) {
    return this.authService.register(createUserRegisterDto);
  }

  @Post('login')
  login(@Body() createUserLoginDto) {
    return this.authService.login(createUserLoginDto);
  }

  @Post('verify')
  verify() {
    return this.verify();
  }

  @Post('forgot-password')
  forgotPassword() {
    return this.forgotPassword();
  }
}
