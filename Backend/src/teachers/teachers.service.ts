import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { DeleteTeacherResponse } from './dto/delete-teacher.dto';
import { SingleTeacherResponseDto } from './dto/single-teacher.dto';
import {
  AllTeacherQueryDto,
  AllTeacherResponseDto,
} from './dto/all-teachers.dto';
import {
  UpdateTeacherDto,
  UpdateTeacherResponseDto,
} from './dto/update-teacher.dto';
import {
  CreateTeacherDto,
  CreateTeacherResponseDto,
} from './dto/create-teacher.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { School, SchoolDocument } from 'src/school/schema/school.schema';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(School.name)
    private readonly schoolModel: Model<SchoolDocument>,
    private readonly mailService: MailService,
  ) {}

  async GetAllTeacher(
    adminId: Types.ObjectId,
    allTeacherQueryDto: AllTeacherQueryDto,
  ): Promise<AllTeacherResponseDto> {
    const { search = '', page = 1, limit = 10 } = allTeacherQueryDto;
    const query: any = {
      role: 'teacher',
      createId: adminId,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const totalNumber = await this.userModel.countDocuments(query);

    const teachers = await this.userModel
      .find(query)
      .select("-password -role -schoolId -createdAt -updatedAt -createId -resetToken -resetTokenExpires -verifyAccountOtp")
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      teachers,
      statusCode: 200,
      totalNumber,
      page,
      limit,
    };
  }

  async GetOneTeacher(id: string): Promise<SingleTeacherResponseDto> {
    const findteacher = await this.userModel.findById(id).populate("createId", "name email").populate("schoolId", "schoolName address");;

    if (!findteacher) {
      return {
        error: 'Teacher not found',
        statusCode: 404,
      };
    }

    return {
      teacher: findteacher,
      statusCode: 200,
    };
  }

async createTeacher(
  createTeacherDto: CreateTeacherDto,
  adminId: Types.ObjectId,
): Promise<CreateTeacherResponseDto> {
  const { name, email, schoolId } = createTeacherDto;

  const findSchool = await this.schoolModel
    .findOne({ adminId })
    .select('schoolName sessionStart sessionEnd');

  if (!findSchool) {
    throw new Error('School not found');
  }

  const existingTeacher = await this.userModel.findOne({ email, role: 'teacher' });
  if (existingTeacher) {
      throw new BadRequestException('A teacher with this email already exists.');

  }

  const rawPassword = Math.random().toString(36).slice(-8);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  const teacher = await this.userModel.create({
    name,
    email,
    schoolId,
    password: hashedPassword,
    createId: adminId,
    role: 'teacher',
    isVerified: true,
  });

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric',
  };
  const currentSession = new Date(findSchool.sessionStart).toLocaleDateString(
    'en-US',
    options,
  );
  const sessionEndDate = new Date(findSchool.sessionEnd).toLocaleDateString(
    'en-US',
    options,
  );

  await this.mailService.sendAccountDetails({
    name: teacher.name,
    email: teacher.email,
    password: rawPassword,
    role: 'Teacher (Hired)',
    schoolName: findSchool.schoolName,
    currentSession,
    sessionEndDate,
  });

  return {
    statusCode: 200,
    message:
      'Created successfully. Email ID and password have been sent. Please check your email.',
    data: { email: teacher.email, password: rawPassword },
  };
}


  async UpdateTeacher(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
    adminId: Types.ObjectId,
  ): Promise<UpdateTeacherResponseDto> {
    const findTeacher = await this.userModel.findById(id);

    if (!findTeacher) {
      return {
        message: 'Teacher not found',
        statusCode: 404,
      };
    }

    if (!findTeacher.createId?.equals(adminId)) {
      return {
        message: 'You are not allowed to update this teacher',
        statusCode: 403,
      };
    }

    await this.userModel.findByIdAndUpdate(
      id,
      { $set: { name: updateTeacherDto.name } },
      { new: true },
    );

    return {
      message: 'Teacher updated successfully',
      statusCode: 200,
    };
  }

  async DeleteTeacher(
    id: string,
    adminId: Types.ObjectId,
  ): Promise<DeleteTeacherResponse> {
    const findTeacher = await this.userModel.findById(id);

    if (!findTeacher) {
      return {
        error: 'Teacher not found',
        statusCode: 404,
      };
    }

    if (!adminId) {
      return {
        error: 'Unauthorized',
        statusCode: 403,
      };
    }

    if (findTeacher.createId && findTeacher.createId.equals(adminId)) {
      await this.userModel.findByIdAndDelete(id);

      return {
        message: 'Teacher deleted successfully',
        statusCode: 200,
      };
    }

    return {
      error: 'You are not allowed to delete this teacher',
      statusCode: 403,
    };
  }
}
