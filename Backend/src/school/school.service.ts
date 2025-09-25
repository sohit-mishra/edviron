import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateSchoolAndUpdateDto,
  UpdateSchoolAndUpdateResponseDto,
} from './dto/update-school.dto';
import { Model, Types } from 'mongoose';
import { School, SchoolDocument } from './schema/school.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name)
    private readonly schoolModel: Model<SchoolDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getSchoolAdmin(adminId: Types.ObjectId) {
    let school = await this.schoolModel.findOne({ adminId }).exec();

    if (!school) {
      school = await this.schoolModel.create({
        schoolName: 'School Name',
        address: 'India',
        phone: '+91 000 000 0000',
        sessionStart: new Date('2024-04-01'),
        sessionEnd: new Date('2025-03-31'),
        adminId,
      });

      await this.userModel.findByIdAndUpdate(
        { _id: adminId },
        { schoolId: school._id },
        { new: true },
      );
    }

    return school;
  }

  async getSelectSchoolAdmin(adminId: Types.ObjectId) {
    let school = await this.schoolModel
      .findOne({ adminId })
      .select('_id, schoolName')
      .exec();
    return school;
  }

  async CreateSchoolAndUpdate(
    id: string,
    updateSchoolAndUpdateDto: UpdateSchoolAndUpdateDto,
  ): Promise<UpdateSchoolAndUpdateResponseDto> {
    const existingSchool = await this.schoolModel.findById(id).exec();

    if (!existingSchool) {
      throw new NotFoundException('School not found');
    }

    const updatedSchool = await this.schoolModel.findByIdAndUpdate(
      id,
      updateSchoolAndUpdateDto,
      { new: true },
    );

    return {
      message: 'School data successfully updated',
      data: updatedSchool,
      statusCode: 200,
    };
  }
}
