import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UpdateStudentDto,
  UpdateStudentResponseDto,
} from './dto/update-student-dto';
import {
  CreateStudentDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { OneStudentResponse } from './dto/one-student.dto';
import { DeleteStudentResponse } from './dto/delete-student.dto';
import { AllStudentResponse, QueryAllStudent } from './dto/all-student.dto';
import { MailService } from 'src/mail/mail.service';
import { School, SchoolDocument } from 'src/school/schema/school.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(School.name)
    private readonly schoolModel: Model<SchoolDocument>,
    private readonly mailService: MailService,
  ) {}

  async GetAllStudent(
    queryAllStudent: QueryAllStudent,
    adminId: Types.ObjectId,
  ): Promise<AllStudentResponse> {
    const adminData = await this.userModel.findById(adminId);
    if (!adminData) {
      throw new UnauthorizedException('User not found');
    }

    if (!['admin', 'teacher'].includes(adminData.role)) {
      throw new UnauthorizedException(
        'Only admins or teachers can view students',
      );
    }

    const { search = '', page = 1, limit = 10 } = queryAllStudent;

    const query: any = { role: 'student' };

    if (adminData.schoolId) {
      query.schoolId = adminData.schoolId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * Number(limit);

    const [students, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip(skip)
        .limit(Number(limit))
        .select('name email totalFees months monthPayment schoolId createId')
        .populate('schoolId', 'schoolName')
        .populate('createId', 'name'),
      this.userModel.countDocuments(query),
    ]);

    return {
      data: students,
      total,
      page: Number(page),
      limit: Number(limit),
      statusCode: 200,
    };
  }

  async GetOneStudent(id: string) {
    const student = await this.userModel
      .findOne({ _id: id, role: 'student' })
      .populate('createId', 'name email')
      .populate('schoolId', 'schoolName address');

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      student,
      statusCode: 200,
    };
  }

  async getSelectStudent(adminId: Types.ObjectId) {
    const findSchool = await this.userModel.findById(adminId);

    if (!findSchool) {
      throw new UnauthorizedException('Admin not found');
    }


    const students = await this.userModel
      .find({ role: 'student', schoolId: findSchool.schoolId })
      .select('_id , name');

    if (!students || students.length === 0) {
      throw new UnauthorizedException('No students found for this school');
    }

    return students;
  }

  async createStudent(
    createStudentDto: CreateStudentDto,
    adminId: Types.ObjectId,
  ): Promise<CreateStudentResponseDto> {
    const { name, email, totalFees, schoolId, months, monthPayment } =
      createStudentDto;

    const findSchool = await this.schoolModel
      .findOne({ adminId })
      .select('schoolName sessionStart sessionEnd');

    if (!findSchool) {
      throw new Error('School not found');
    }
    const schoolObjectId = new Types.ObjectId(schoolId);
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser && !existingUser.schoolId?.equals(schoolObjectId)) {
      throw new BadRequestException(
        'A user with this email already exists in another school.',
      );
    }

    const rawPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

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
      name,
      email,
      password: rawPassword,
      role: 'Student (Fees Payment)',
      schoolName: findSchool.schoolName,
      currentSession,
      sessionEndDate,
    });

    const calculatedMonthPayment =
      monthPayment || (Number(totalFees) / Number(months)).toFixed(2);

    await this.userModel.create({
      name,
      email,
      totalFees,
      months,
      monthPayment: calculatedMonthPayment,
      password: hashedPassword,
      createId: new  Types.ObjectId(adminId),
      role: 'student',
      schoolId :new  Types.ObjectId(schoolId),
      isVerified: true,
      paymentClear: 0
    });

    return {
      message: 'Student created successfully',
      statusCode: 201,
      data: {
        email,
        password: rawPassword,
        totalFees,
        months,
      },
    };
  }

  async UpdateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
    adminId: Types.ObjectId,
  ): Promise<UpdateStudentResponseDto> {
    const { name, months } = updateStudentDto;

    const student = await this.userModel.findById(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const updateData = await this.userModel.findById(adminId);
    if (!updateData) {
      throw new UnauthorizedException('User not found');
    }

    if (!['admin', 'teacher'].includes(updateData.role)) {
      throw new UnauthorizedException(
        'Only admins or teachers can update students',
      );
    }

    const updatedStudent = await this.userModel.findByIdAndUpdate(
      id,
      { name, months },
      { new: true },
    );

    return {
      message: 'Student updated successfully',
      statusCode: 200,
    };
  }

  async DeleteStudent(
    id: string,
    adminId: Types.ObjectId,
  ): Promise<DeleteStudentResponse> {
    const studentExisting = await this.userModel.findOne({
      _id: id,
      role: 'student',
    });

    if (!studentExisting) {
      throw new UnauthorizedException(
        'Student not found or invalid credentials',
      );
    }

    const deletePerson = await this.userModel.findById(adminId);
    if (!deletePerson) {
      throw new UnauthorizedException('User not found');
    }

    if (!['admin', 'teacher'].includes(deletePerson.role)) {
      throw new UnauthorizedException(
        'Only admins or teachers can delete students',
      );
    }

    if (String(studentExisting.schoolId) !== String(deletePerson.schoolId)) {
      throw new UnauthorizedException(
        'Not allowed to delete student from another school',
      );
    }

    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'Student deleted successfully',
      statusCode: 200,
    };
  }
}
