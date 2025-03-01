import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCodeResetPassword(name: string, email: string,activationCode: string ){
    this.mailerService.sendMail({
      to: 'phap.nguyennhat@hcmut.edu.vn', // list of receivers
      subject: 'Fasco Shop Verifycation Code to reset password', // Subject line
      text: 'welcome', // plaintext body
      // html: '<b>Hello phap </b>', // HTML body content
      template: 'forgetPassword',
      context: {
        name, email, activationCode
      },
    });
    return {message: 'send email successfully '}
  }
}
