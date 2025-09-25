import { Injectable } from '@nestjs/common';
import { GetAllQueryTransactions } from './dto/get-all-transactions.dto';
import { OrderStatus, OrderStatusDocument } from './schemas/order-status.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(OrderStatus.name)
    private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getAllTransactions(query: GetAllQueryTransactions) {
    const { search, sort, limit = 10, page = 1 } = query;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { payment_message: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { bank_reference: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption: any = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOption[field] = order === 'desc' ? -1 : 1;
    }

    const transactions = await this.orderStatusModel
      .find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.orderStatusModel.countDocuments(filter);

    return { transactions, total, page, limit };
  }
}
