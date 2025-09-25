import { TransactionsService } from './transactions.service';
import { PaymentService } from './../payment/payment.service';
import { Controller, Get, Query } from '@nestjs/common';
import { GetAllQueryTransactions } from './dto/get-all-transactions.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService : TransactionsService){}

    @Get('all')
    async getAllTransactions(@Query() getAllQueryTransactions : GetAllQueryTransactions){
        return await this.transactionsService.getAllTransactions(getAllQueryTransactions)
    }

    @Get('transaction-status/:custom_order_id')
    async checkTransactionStatus(){

    }
}
