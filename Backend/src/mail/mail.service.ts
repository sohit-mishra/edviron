import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendForgotPassword(name: string, email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'forgot-password',
        context: {
          name,
          email,
          resetLink: `${frontendUrl}/resetpassword/${token}`,
          year: new Date().getFullYear(),
        },
      });

      console.log(`Forgot password email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`Failed to send forgot password email to ${email}:`, error);
      return false;
    }
  }

  async sendEmailOtp(name: string, email: string, otp: number) {
    console.log(email, otp);
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your One-Time Password (OTP)',
        template: 'email-otp',
        context: {
          name,
          email,
          otp,
          year: new Date().getFullYear(),
        },
      });

      console.log(`OTP email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`Failed to send OTP email to ${email}:`, error);
      return false;
    }
  }

  async sendPasswordUpdateNotice(email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Password Has Been Updated',
        template: 'password-update',
        context: {
          email,
          year: new Date().getFullYear(),
        },
      });

      console.log(`Password update notice sent to ${email}`);
    } catch (error) {
      console.error(
        `Failed to send password update notice to ${email}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to send password update notice',
      );
    }
  }

  async sendPaymentSuccessful(
    email: string,
    studentName: string,
    transactionAmount: number,
    schoolName: string,
    gateway: string,
    transactionId: string,
    paymentTime: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Payment Successful',
        template: 'payment-successful',
        context: {
          studentName,
          transactionAmount,
          schoolName,
          gateway,
          transactionId,
          paymentTime,
          year: new Date().getFullYear(),
        },
      });

      console.log(`Payment successful email sent to ${email}`);
    } catch (error) {
      console.error(
        `Failed to send payment successful email to ${email}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to send payment success notice',
      );
    }
  }

  async sendPaymentFailed(
    email: string,
    studentName: string,
    transactionAmount: number,
    schoolName: string,
    transactionId: string,
    paymentTime: string,
    errorMessage: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Payment Failed',
        template: 'payment-failed',
        context: {
          studentName,
          transactionAmount,
          schoolName,
          transactionId,
          paymentTime,
          errorMessage,
          year: new Date().getFullYear(),
        },
      });

      console.log(`Payment failed email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send payment failed email to ${email}:`, error);
      throw new InternalServerErrorException(
        'Failed to send payment failure notice',
      );
    }
  }

  async sendAccountDetails(params: {
    name: string;
    email: string;
    password: string;
    role: string;
    schoolName: string;
    currentSession: string;
    sessionEndDate: string;
  }): Promise<void> {
    const {
      name,
      email,
      password,
      role,
      schoolName,
      currentSession,
      sessionEndDate,
    } = params;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Account Details - Join ${schoolName}`,
        template: 'account-details',
        context: {
          name,
          email,
          password,
          role,
          schoolName,
          currentSession,
          sessionEndDate,
          year: new Date().getFullYear(),
        },
      });

      console.log(`Account Details email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send Account Details email to ${email}:`, error);
      throw new InternalServerErrorException(
        'Failed to send account details email',
      );
    }
  }
}
