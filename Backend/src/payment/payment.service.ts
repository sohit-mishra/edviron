import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from 'src/transactions/schemas/order-status.schema';
import { CreatePaymentBodyDto } from './dto/create-payment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private readonly orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  private readonly CF_APP_ID =  process.env.CF_APP_ID;
  private readonly CF_SECRET = process.env.CF_SECRET;
  private readonly CF_STAGE = true;

  async CreatePayment(createPaymentBodyDto: CreatePaymentBodyDto) {
    const { collect_id, order_amount, email, name } = createPaymentBodyDto;

    if (!collect_id || !order_amount || !email || !name) {
      throw new HttpException('Missing required payment fields', 400);
    }

    const orderStatus: OrderStatusDocument = await this.orderStatusModel.create({
      collect_id: new Types.ObjectId(collect_id),
      order_amount: order_amount,
      transaction_amount: 0,
      payment_mode: '',
      payment_details: '',
      bank_reference: '',
      payment_message: 'Payment Pending',
      status: 'pending',
      error_message: '',
      payment_time: new Date(),
    });

    const url = this.CF_STAGE
      ? 'https://sandbox.cashfree.com/pg/orders'
      : 'https://api.cashfree.com/pg/orders';

    const payload = {
      order_id: `${orderStatus._id}`,
      order_amount: Number(order_amount).toFixed(2),
      order_currency: 'INR',
      customer_details: {
        customer_id: orderStatus._id.toString(),
        customer_name: name,
        customer_email: email,
        customer_phone: '9999999999',
      },
       order_meta: {
      return_url: `${process.env.FRONTEND_URL}/payment_status/${orderStatus._id}`,
    },
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-client-id': this.CF_APP_ID,
      'x-client-secret': this.CF_SECRET,
      'x-api-version': '2022-01-01',
    };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data;
    } catch (error: any) {
      console.error('Cashfree API Error:', error.response?.data || error.message);
      throw new HttpException('Failed to create Cashfree payment session', 500);
    }
  }

  async getPaymentDetails(collectId: string) {
    const payment = await this.orderStatusModel
      .findOne({ collect_id: collectId });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    return payment;
  }
}
