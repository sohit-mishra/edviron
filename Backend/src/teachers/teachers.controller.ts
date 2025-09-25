import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Types } from 'mongoose';
import { AllTeacherQueryDto } from './dto/all-teachers.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async GetAllTeacher(@Req() req: any, @Query() allTeacherQueryDto: AllTeacherQueryDto) {
    const adminId = new Types.ObjectId(req.user.userId);
    return await this.teachersService.GetAllTeacher(
      adminId,
      allTeacherQueryDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async GetOneTeacher(@Param('id') id: string) {
    return await this.teachersService.GetOneTeacher(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto, @Req() req: any) {
    const adminId = new Types.ObjectId(req.user.userId);
    return await this.teachersService.createTeacher(createTeacherDto, adminId);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async UpdateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @Req() req: any,
  ) {
    const adminId = new Types.ObjectId(req.user.userId);
    return await this.teachersService.UpdateTeacher(
      id,
      updateTeacherDto,
      adminId,
    );
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async DeleteTeacher(@Req() req: any, @Param('id') id: string) {
    const adminId = new Types.ObjectId(req.user.userId);
    return await this.teachersService.DeleteTeacher(id, adminId);
  }
}
