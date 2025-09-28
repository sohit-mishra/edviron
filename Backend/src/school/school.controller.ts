import { SchoolService } from './school.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateSchoolAndUpdateDto } from './dto/update-school.dto';
import { Types } from 'mongoose';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getSchoolAdmin(@Req() req: any) {
    const adminId = new Types.ObjectId(req.user.userId);
    return await this.schoolService.getSchoolAdmin(adminId);
  }

  @Get('select')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async getSelectSchoolAdmin(@Req() req: any) {
    const adminId = new Types.ObjectId(req.user.userId);
    const role = req.user.role;
    return await this.schoolService.getSelectSchoolAdmin(adminId, role);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async CreateSchoolAndUpdate(
    @Param('id') id: string,
    @Body() updateSchoolAndUpdateDto: UpdateSchoolAndUpdateDto,
  ) {
    return await this.schoolService.CreateSchoolAndUpdate(
      id,
      updateSchoolAndUpdateDto,
    );
  }
}
