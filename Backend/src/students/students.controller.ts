import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { StudentsService } from './students.service';
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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student-dto';
import { QueryAllStudent } from './dto/all-student.dto';
import { Types } from 'mongoose';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async GetAllStudent(
    @Query() queryAllStudent: QueryAllStudent,
    @Req() req: any,
  ) {
    const adminId = new Types.ObjectId(req.user.userId);
    return this.studentsService.GetAllStudent(queryAllStudent, adminId);
  }

  @Get('option')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async getSelectStudent(@Req() req: any) {
    const adminId = new Types.ObjectId(req.user.userId);
    return this.studentsService.getSelectStudent(adminId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async GetOneStudent(@Param('id') id: string) {
    return this.studentsService.GetOneStudent(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
    @Req() req: any,
  ) {
    const adminId = new Types.ObjectId(req.user.userId);
    return this.studentsService.createStudent(createStudentDto, adminId);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async UpdateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() req: any,
  ) {
    const adminId = new Types.ObjectId(req.user.userId);
    return this.studentsService.UpdateStudent(id, updateStudentDto, adminId);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async DeleteStudent(@Param('id') id: string, @Req() req: any) {
    const adminId = new Types.ObjectId(req.user.userId);
    return this.studentsService.DeleteStudent(id, adminId);
  }
}
