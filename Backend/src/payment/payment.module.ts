import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { Order, OrderSchema } from 'src/orders/schemas/order.schema';
import { OrderStatus, OrderStatusSchema } from 'src/transactions/schemas/order-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
    ]),
  ],
  providers: [PaymentService],
  exports: [PaymentService], 
})
export class PaymentModule {}
