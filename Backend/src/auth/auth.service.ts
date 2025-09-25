import {
  CreateForgetPassword,
  CreateForgetPasswordResponseDto,
} from './dto/create-forget-password.dto';
import { CreateLoginDto, CreateLoginResponseDto } from './dto/create-login.dto';
import { CreateOtpDto, CreateOtpResponseDto } from './dto/create-Otp.dto';
import {
  CreateRefreshTokenDto,
  CreateRefreshTokenResponseDto,
} from './dto/create-refresh-token.dto';
import {
  CreateResetPasswordDto,
  CreateResetPasswordResponseDto,
} from './dto/create-reset-password.dto';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      throw new ConflictException('User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000);
    if (!otp) {
      throw new Error('OTP generation failed');
    }

    let user;

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.verifyAccountOtp = otp;
      existingUser.role = 'admin';
      user = existingUser;
    } else {
      user = new this.userModel({
        name,
        email,
        password: hashedPassword,
        verifyAccountOtp: otp,
        role: 'admin',
      });
    }

    const emailSent = await this.mailService.sendEmailOtp(name, email, otp);
    if (!emailSent) {
      throw new Error('Failed to send OTP email');
    }

    await user.save();

    return {
      message: 'User created successfully. OTP sent to email.',
      statusCode: 201,
    };
  }

  async login(createLoginDto: CreateLoginDto): Promise<CreateLoginResponseDto> {
    const { email, password } = createLoginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email , role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const sendUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'OTP sent successfully',
      statusCode: 200,
      accessToken,
      user: sendUser,
      refreshToken,
    };
  }

  async forgetPassword(
    createForgetPassword: CreateForgetPassword,
  ): Promise<CreateForgetPasswordResponseDto> {
    const { email } = createForgetPassword;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.resetToken = randomBytes(32).toString('hex');
    user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const emailSent = await this.mailService.sendForgotPassword(
      user.name,
      user.email,
      user.resetToken,
    );

    if (!emailSent) {
      throw new Error('Failed to send reset email');
    }

    return {
      message: 'Reset token generated and sent to email',
      statusCode: 200,
    };
  }

  async verifyOtp(createOtpDto: CreateOtpDto): Promise<CreateOtpResponseDto> {
    const { email, otp } = createOtpDto;
    const user = await this.userModel.findOne({ email });

    if (!user || user.verifyAccountOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    user.isVerified = true;
    user.verifyAccountOtp = undefined;
    await user.save();

    return {
      message: 'Account verified successfully',
      statusCode: 200,
    };
  }

  async resetPassword(
    createResetPasswordDto: CreateResetPasswordDto,
  ): Promise<CreateResetPasswordResponseDto> {
    const { resetToken, password } = createResetPasswordDto;

    const user = await this.userModel.findOne({ resetToken });

    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    try {
      await this.mailService.sendPasswordUpdateNotice(user.email);
    } catch (error) {
      console.error('Failed to send password update email:', error);
    }

    return {
      message: 'Password reset successfully',
      statusCode: 200,
    };
  }

  async refreshToken(
    createRefreshTokenDto: CreateRefreshTokenDto,
  ): Promise<CreateRefreshTokenResponseDto> {
    const { refreshToken: oldRefreshToken } = createRefreshTokenDto;

    try {
      const payload = this.jwtService.verify(oldRefreshToken);

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email , role: payload.role },
        { expiresIn: '30m' },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email , role: payload.role  },
        { expiresIn: '7d' },
      );

      return {
        message: 'Access token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        statusCode: 200,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
