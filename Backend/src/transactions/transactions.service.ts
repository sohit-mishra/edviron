import { Injectable } from '@nestjs/common';
import { GetAllQueryTransactions } from './dto/get-all-transactions.dto';
import {
  OrderStatus,
  OrderStatusDocument,
} from './schemas/order-status.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(OrderStatus.name)
    private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getAllTransactions(query: GetAllQueryTransactions) {
    const { search, status, limit = 10, page = 1 } = query;

    const filter: any = {};

    if (search) {
      filter['student_info.name'] = { $regex: search, $options: 'i' };
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    const transactions = await this.orderStatusModel
      .find(filter)
      .skip((page - 1) * limit)
      .sort({payment_time : -1})
      .limit(limit)
      .populate('')
      .select(
        '-collect_id -transaction_amount -payment_details -bank_reference -payment_message -school_id',
      )
      .lean();

    const total = await this.orderStatusModel.countDocuments(filter);

    return { transactions, total, page, limit };
  }
}
