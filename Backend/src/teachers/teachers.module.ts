import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { School, SchoolSchema } from 'src/school/schema/school.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name : User.name, schema : UserSchema},
    { name: School.name, schema: SchoolSchema },
  ]), MailModule],
  controllers: [TeachersController],
  providers: [TeachersService]
})
export class TeachersModule {}
