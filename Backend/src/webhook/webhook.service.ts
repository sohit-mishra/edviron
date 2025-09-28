import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { OrderStatus, OrderStatusDocument } from 'src/transactions/schemas/order-status.schema';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(OrderStatus.name)
    private orderStatusModel: Model<OrderStatusDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async handleWebhook(body: any) {
    console.log(body);
    // const orderId = body.data?.order?.order_id;
    // if (!orderId) {
    //   console.log('Webhook missing order_id:', body);
    //   return { status: 'error', message: 'Missing order_id' };
    // }

    // const payment = body.data?.payment || {};

    // let paymentDetails = '';
    // if (payment.payment_mode === 'CARD') {
    //   const brand = payment.card_brand || 'Card';
    //   const last4 = payment.card_last4 || '****';
    //   paymentDetails = `${brand} ending with ${last4}`;
    // } else {
    //   paymentDetails = `${payment.payment_mode || 'UNKNOWN'} - ${payment.payment_message || ''}`;
    // }

    // const updatedOrder = await this.orderStatusModel.findOneAndUpdate(
    //   { order_id: orderId },
    //   {
    //     transaction_amount: payment.payment_amount || 0,
    //     payment_mode: payment.payment_mode || '',
    //     payment_details: paymentDetails,
    //     bank_reference: payment.bank_reference || '',
    //     payment_message: payment.payment_message || '',
    //     status: payment.payment_status || 'PENDING',
    //     payment_time: payment.payment_time ? new Date(payment.payment_time) : new Date(),
    //   },
    //   { new: true },
    // );

    // if (!updatedOrder) {
    //   console.log('Order not found:', orderId);
    //   return { status: 'error', message: 'Order not found' };
    // }

    // const studentId = updatedOrder.student_info.student_id;

    // const updatedStudent = await this.userModel.findByIdAndUpdate(
    //   studentId,
    //   {
    //     $inc: { paymentClear: payment.payment_amount || 0, months: -1 },
    //   },
    //   { new: true },
    // );

    // console.log('Updated Student:', updatedStudent);

    // return { status: 'ok' };
  }
}
