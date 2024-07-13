import {
  Body,
  Controller,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRegisterDto } from './dto/create-user-register.dto';
import { User } from 'src/user/user.entity';
import { CreateUserVerifyDto } from './dto/create-user-verify.dto';
import { CreateUserLoginDto } from './dto/create-user-logn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(
    @Body() createUserRegisterDto: CreateUserRegisterDto,
  ): Promise<User> {
    return this.authService.register(createUserRegisterDto);
  }

  @Post('login')
  login(@Body() createUserLoginDto: CreateUserLoginDto) {
    return this.authService.login(createUserLoginDto);
  }

  @Put('activate-account')
  activateAccount(@Body() createUserVerifyDto: CreateUserVerifyDto) {
    return this.authService.activateAccount(createUserVerifyDto);
  }

  @Post('forgot-password')
  forgotPassword() {
    return this.forgotPassword();
  }
}
