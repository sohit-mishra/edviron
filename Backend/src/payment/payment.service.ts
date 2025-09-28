import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from 'src/orders/schemas/order.schema';
import {
  OrderStatus,
  OrderStatusDocument,
} from 'src/transactions/schemas/order-status.schema';
import { CreatePaymentBodyDto } from './dto/create-payment.dto';
import axios from 'axios';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { CashfreePaymentResponseDto } from './dto/checkStatus.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(OrderStatus.name)
    private readonly orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  private readonly CF_APP_ID = process.env.CF_APP_ID;
  private readonly CF_SECRET = process.env.CF_SECRET;
  private readonly CF_STAGE = process.env.CF_STAGE;

  async CreatePayment(createPaymentBodyDto: CreatePaymentBodyDto) {
    const {
      collect_id,
      order_amount,
      email,
      name,
      student_id,
      order_id,
      phone,
    } = createPaymentBodyDto;

    const findStudent = await this.userModel.findById(student_id);
    if (!findStudent) {
      throw new HttpException('Student not found', 404);
    }

    const findOrder = await this.orderModel.findOne({ Order_id: order_id });
    if (!findOrder) {
      throw new HttpException('Order not found', 404);
    }

    if (!collect_id || !order_amount || !email || !name) {
      throw new HttpException('Missing required payment fields', 400);
    }

    const orderStatus: OrderStatusDocument = await this.orderStatusModel.create(
      {
        collect_id: new Types.ObjectId(collect_id),
        order_amount,
        transaction_amount: 0,
        payment_mode: '',
        payment_details: '',
        bank_reference: '',
        payment_message: 'Payment Pending',
        status: 'PENDING',
        error_message: '',
        payment_time: new Date(),
        student_info: {
          student_id: new Types.ObjectId(student_id),
          name: name,
          email: email,
          phone: phone,
        },
        school_id: new Types.ObjectId(findStudent.schoolId),
        order_id,
      },
    );

    const url =
      this.CF_STAGE === 'SANDBOX'
        ? 'https://sandbox.cashfree.com/pg/orders'
        : 'https://api.cashfree.com/pg/orders';

    const payload = {
      order_id: orderStatus.order_id,
      order_amount: Number(order_amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: String(student_id),
        customer_name: name,
        customer_email: email,
        customer_phone: `+91${phone}`,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment_status/${order_id}`,
        notify_url: `${process.env.BACKEND_URL}/api/webhook`,
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
      console.error(
        'Cashfree API Error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message ||
          'Failed to create Cashfree payment session',
        500,
      );
    }
  }

  async getPaymentDetails(orderId: string) {
    const payment = await this.orderStatusModel.findOne({ order_id: orderId });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    const url =
      this.CF_STAGE === 'SANDBOX'
        ? `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`
        : `https://api.cashfree.com/pg/orders/${orderId}/payments`;

    const headers = {
      'x-client-id': this.CF_APP_ID,
      'x-client-secret': this.CF_SECRET,
      'x-api-version': '2022-01-01',
    };

    const studentDetails = await this.userModel.findById(payment.student_info.student_id)


    try {
      const { data } = await axios.get(url, { headers });

      const SendData = {
        bank_reference : data[0].bank_reference,
        cf_payment_id: data[0].cf_payment_id,
        order_amount: data[0].order_amount,
        order_id: data[0].order_id,
        payment_amount: data[0].payment_amount,
        payment_completion_time: data[0].payment_completion_time,
        payment_currency: data[0].payment_currency,
        payment_group: data[0].payment_group,
        payment_message:data[0].payment_message,
        payment_method: data[0].payment_method,
        payment_status: data[0].payment_status,
        payment_time : data[0].payment_time,
        student_name: studentDetails?.name,
        student_email: studentDetails?.email,
        totalFees: studentDetails?.totalFees,
        months: studentDetails?.months,
        monthPayment: studentDetails?.monthPayment,
        paymentClear: studentDetails?.paymentClear,
      }

      return SendData;

    } catch (error: any) {
      console.error(
        'Cashfree API Error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch payment details',
        500,
      );
    }
  }

  async checkPaymentStatus(
    orderId: string,
  ): Promise<CashfreePaymentResponseDto> {
    const payment = await this.orderStatusModel.findOne({ order_id: orderId });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    const url =
      this.CF_STAGE === 'SANDBOX'
        ? `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`
        : `https://api.cashfree.com/pg/orders/${orderId}/payments`;

    const headers = {
      'x-client-id': this.CF_APP_ID,
      'x-client-secret': this.CF_SECRET,
      'x-api-version': '2022-01-01',
    };

    try {
      const response = await axios.get<{
        payments: CashfreePaymentResponseDto[];
      }>(url, {
        headers,
      });

      const data = response.data[0];
      
      const checkStatus: CashfreePaymentResponseDto = {
        cf_payment_id: data.cf_payment_id,
        order_id: data.order_id,
        payment_status: data.payment_status,
        payment_message: data.payment_message,
        payment_amount: data.payment_amount,
        error_details: data.error_details,
        bank_reference: data.bank_reference,
        payment_time: data.payment_time,
      };

      return checkStatus;
    } catch (error: any) {
      console.error(
        'Cashfree API Error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch payment details',
        500,
      );
    }
  }
}
