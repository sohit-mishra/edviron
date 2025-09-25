import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';
import { WebhookService } from './webhook/webhook.service';
import { WebhookModule } from './webhook/webhook.module';
import { APP_GUARD } from '@nestjs/core';
import { MailService } from './mail/mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { MailModule } from './mail/mail.module';
import { SchoolController } from './school/school.controller';
import { SchoolService } from './school/school.service';
import { SchoolModule } from './school/school.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/edviron'),
    AuthModule,
    OrdersModule,
    TransactionsModule,
    PaymentModule,
    WebhookModule,
    MailModule,
    SchoolModule,
    UserModule,
    TeachersModule,
    StudentsModule,
  ],
  controllers: [AppController, PaymentController, SchoolController, UserController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    AppService,
    WebhookService,
    MailService,
  ],
})
export class AppModule {}
