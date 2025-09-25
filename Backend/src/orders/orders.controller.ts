import { OrdersService } from './orders.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GetAllQueryOrder } from './dto/get-all-order.dto';
import { CreateOrderBodyDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService){}

  @Get()
  async getAllOrders(@Query() getAllQuery : GetAllQueryOrder) {
    return await this.ordersService.getAllOrders(getAllQuery)
  }

  @Get(':id')
  async getOrderDetails(@Param('id') id:string) {
    return await this.ordersService.getOrderDetails(id);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderBodyDto) {
    return await this.ordersService.createOrder(createOrderDto);
  }
}
