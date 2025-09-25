import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { OrderStatus, OrderStatusSchema } from './schemas/order-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderStatus.name, schema: OrderStatusSchema }]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
