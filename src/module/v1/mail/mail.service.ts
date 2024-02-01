import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMail } from './interface/mail.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail({ to, subject, template, attachments }: ISendMail) {
    await this.mailerService.sendMail({
      to,
      subject,
      html: template,
      attachments,
    });
  }

}
