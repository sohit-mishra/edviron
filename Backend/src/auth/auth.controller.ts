import { AuthService } from './auth.service';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { CreateForgetPassword } from './dto/create-forget-password.dto';
import { CreateOtpDto } from './dto/create-Otp.dto';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async createAccount(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createAccount(createUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() createLoginDto: CreateLoginDto) {
    return await this.authService.login(createLoginDto);
  }

  @Public()
  @Post('forgetPassword')
  async forgetPassword(@Body() createForgetPassword: CreateForgetPassword) {
    return await this.authService.forgetPassword(createForgetPassword);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() createOtpDto: CreateOtpDto) {
    return await this.authService.verifyOtp(createOtpDto);
  }

  @Public()
  @Post('resetPassword')
  async resetPassword(@Body() createResetPasswordDto: CreateResetPasswordDto) {
    return await this.authService.resetPassword(createResetPasswordDto);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() createRefreshTokenDto: CreateRefreshTokenDto) {
    return await this.authService.refreshToken(createRefreshTokenDto);
  }
}
