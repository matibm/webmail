import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailGateway } from './mail.gateway';
import { IdleService } from './idle.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [MailService, MailGateway, IdleService],
  controllers: [MailController]
})
export class MailModule { }
