import { WebhookService } from './webhook.service';
import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @Public()
  async handleWebhook(@Body() body: any) {
    return this.webhookService.handleWebhook(body);
  }
}
