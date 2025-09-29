import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
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
import { SchoolModule } from './school/school.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable not set');
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
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
    MailService,
  ],
})
export class AppModule {}
