import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import {
  CreateOrderBodyDto,
  CreateOrderBodyResponseDto,
} from './dto/create-order.dto';
import {
  GetAllOrderResponseDto,
  GetAllQueryOrder,
} from './dto/get-all-order.dto';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { ResponseSingleOrderdto } from './dto/singleOrder.dtt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) readonly userModel: Model<UserDocument>,
  ) {}

  async getAllOrders(query: GetAllQueryOrder): Promise<GetAllOrderResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const sort = query.sort || '-createdAt';
    const search = query.search || '';

    const filter: any = {};
    if (search) {
      filter.$or = [{ gateway_name: { $regex: search, $options: 'i' } }];
    }

    const orders = await this.orderModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.orderModel.countDocuments(filter);

    return {
      orders,
      statusCode: 200,
      message: 'Orders fetched successfully',
      total,
      page,
      limit,
    };
  }

  async getOrderDetails(id: string): Promise<ResponseSingleOrderdto> {
    const findOrder = await this.orderModel.findOne({Order_id : id});

    if (!findOrder) {
      throw new Error('Order not found');
    }
    const studentDetail = await this.userModel.findById(findOrder.student_info);

    if (!studentDetail) {
      throw new Error('Student not found');
    }

    const orderData = {
      totalFees: studentDetail.totalFees,
      monthPayment: studentDetail.monthPayment,
      paymentClear: studentDetail.paymentClear || 0,
      email: studentDetail.email,
      _id: studentDetail._id,
      name: studentDetail.name,
      studentId: findOrder?.student_info,
      schoolId: findOrder?.school_id,
      Order_id : id
    };

    return {
      order: orderData,
      statusCode: 200,
    };
  }

  async createOrder(
    createOrderDto: CreateOrderBodyDto,
  ): Promise<CreateOrderBodyResponseDto> {
    function generateOrderId(): string {
      return `ORD-${uuidv4()}`;
    }
    const order = new this.orderModel({
      ...createOrderDto,
      school_id: new Types.ObjectId(createOrderDto.school_id),
      trustee_id: createOrderDto.trustee_id,
      student_info: new Types.ObjectId(createOrderDto.student_info),
      Order_id: generateOrderId(),
    });

    const savedOrder = await order.save();

    return {
      statusCode: 201,
      message: 'Order created successfully',
      data: savedOrder,
    };
  }
}
