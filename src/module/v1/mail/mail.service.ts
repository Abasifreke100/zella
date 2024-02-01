import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMail } from './interface/mail.interface';
import { environment } from 'src/common/config/environment';
import * as sendGrid from '@sendgrid/mail';

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

  // async sendMail({ to, subject, template, attachments }: ISendMail) {
  //   const body = {
  //     to,
  //     from: {
  //       email: environment.APP.EMAIL,
  //       name: environment.APP.NAME,
  //     },
  //     replyTo: {
  //       email: environment.APP.EMAIL,
  //       name: environment.APP.NAME,
  //     },
  //     subject,
  //     html: template,
  //     attachments,
  //   };
  //
  //   sendGrid.setApiKey(environment.SENDGRID);
  //   sendGrid
  //     .send(body)
  //     .then((response) => {
  //       console.log(response[0].statusCode);
  //       console.log(response[0].headers);
  //     })
  //     .catch((error) => {
  //       console.error(JSON.stringify(error));
  //     });
  // }
}
