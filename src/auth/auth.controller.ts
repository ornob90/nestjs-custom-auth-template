import {
  Body,
  Controller,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRegisterDto } from './dto/create-user-register.dto';
import { User } from 'src/user/user.entity';

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
  login(@Body() createUserLoginDto) {
    return this.authService.login(createUserLoginDto);
  }

  @Post('verify')
  verify(@Body() ) {
    return this.verify();
  }

  @Post('forgot-password')
  forgotPassword() {
    return this.forgotPassword();
  }
}
