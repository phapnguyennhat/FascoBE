import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('email')
export class EmailController {
  constructor(
    private readonly mailerService: MailerService
  ) {}

  // @Post()
  // async sendMail (){
  //   this.mailerService.sendMail({
  //     to: 'phap.nguyennhat@hcmut.edu.vn', // list of receivers
  //     subject: 'Testing Nest MailerModule ✔', // Subject line
  //     text: 'welcome', // plaintext body
  //     // html: '<b>Hello phap </b>', // HTML body content
  //     template: 'forgetPassword',
  //     context: {
  //       name: 'Phap',
  //       email: 'phap.nguyennhat@hcmut.edu.vn',
  //       activationCode: 12345689,
  //     },
  //   });
  //   return 'oke';
  // }
}
