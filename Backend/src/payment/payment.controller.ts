import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePaymentBodyDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async CreatePayment(@Body() createPaymentBodyDto: CreatePaymentBodyDto) {
    return await this.paymentService.CreatePayment(createPaymentBodyDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async getPaymentDetails(@Param('id') id: string) {
    return await this.paymentService.getPaymentDetails(id);
  }

  @Get('checkStatus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher , Role.Student)
  async checkPaymentStatus(@Param('id') id: string) {
    return await this.paymentService.checkPaymentStatus(id);
  }

}
