import { UserService } from './user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    const adminId = new Types.ObjectId(req.user.userId);
    return await this.userService.getProfile(adminId);
  }

  @Public()
  @Get('/health')
  async health() {
    return { statusCode: 200 };
  }
}
