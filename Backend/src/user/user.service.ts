import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { ProfileResponseDto } from './dto/ProfileResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getProfile(adminId: Types.ObjectId): Promise<ProfileResponseDto> {
    const existingUser = await this.userModel
      .findById(adminId)
      .select(
        '-isVerified -password -createdAt -updatedAt -createId -resetToken -resetTokenExpires -verifyAccountOtp',
      );

    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: existingUser,
      statusCode: 200,
    };
  }
}
