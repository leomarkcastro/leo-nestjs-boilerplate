import { CONFIG } from '@/config/env';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-typescript';
import { TemplatesService } from '../templates/templates.service';

@Injectable()
export class MailBrevoService {
  constructor(private readonly templateService: TemplatesService) {}

  async _sendEmailRoutine(options: ISendMailOptions) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // @ts-expect-error - this just works, if there's a way to properly type this, please let me know
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = CONFIG.MAILER_BREVO_API_KEY;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html as string;
    sendSmtpEmail.sender = {
      name: CONFIG.MAILER_NAME,
      email: CONFIG.MAILER_EMAILADDRESS,
    };
    sendSmtpEmail.to = [
      {
        email: options.to as string,
      },
    ];
    if (options.cc) sendSmtpEmail.cc = [{ email: options.cc as string }];
    // sendSmtpEmail.bcc = [{ name: 'John Doe', email: 'example@example.com' }];
    // sendSmtpEmail.replyTo = { email: 'replyto@domain.com', name: 'John Doe' };
    // sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
    // sendSmtpEmail.params = {
    //   parameter: 'My param value',
    //   subject: 'New Subject',
    // };

    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  async sendEmail(
    to: string,
    subject: string,
    plainTextMessage: string,
    htmlMessage: string,
  ) {
    const messageId = await this._sendEmailRoutine({
      to: to,
      cc: '',
      subject: subject,
      text: plainTextMessage,
      html: htmlMessage,
      textEncoding: 'base64',
    });

    return messageId;
  }

  async sendEmailFromTemplate(
    to: string,
    subject: string,
    plainTextMessage: string,
    htmlFileLocation: string,
    templateVariables:
      | {
          [key: string]: string;
        }
      | any,
  ) {
    // read the html
    // replace the template variables
    const htmlText = await this.templateService.getTemplate(
      htmlFileLocation,
      templateVariables,
    );

    // send the email
    const messageId = await this.sendEmail(
      to,
      subject,
      plainTextMessage,
      htmlText,
    );

    return messageId;
  }

  async _sendBatchEmailRoutine(
    options: ISendMailOptions,
    messageVersions: SibApiV3Sdk.SendSmtpEmailMessageVersions[],
  ) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // @ts-expect-error - this just works, if there's a way to properly type this, please let me know
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = CONFIG.MAILER_BREVO_API_KEY;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html as string;
    sendSmtpEmail.sender = {
      name: CONFIG.MAILER_NAME,
      email: CONFIG.MAILER_EMAILADDRESS,
    };
    if (options.cc) sendSmtpEmail.cc = [{ email: options.cc as string }];
    // sendSmtpEmail.bcc = [{ name: 'John Doe', email: 'example@example.com' }];
    // sendSmtpEmail.replyTo = { email: 'replyto@domain.com', name: 'John Doe' };
    // sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
    // sendSmtpEmail.params = {
    //   parameter: 'My param value',
    //   subject: 'New Subject',
    // };
    sendSmtpEmail.messageVersions = messageVersions;

    try {
      const res = await apiInstance.sendTransacEmail(sendSmtpEmail);
      // Logger.log(res);
      return res;
    } catch (err) {
      Logger.error(err);
    }
  }

  async sendBatchEmail(
    messageVersions: SibApiV3Sdk.SendSmtpEmailMessageVersions[],
    subject: string,
    plainTextMessage: string,
    htmlMessage: string,
  ) {
    const messageId = await this._sendBatchEmailRoutine(
      {
        subject: subject,
        text: plainTextMessage,
        html: htmlMessage,
        textEncoding: 'base64',
      },
      messageVersions,
    );

    return messageId;
  }

  async sendBatchEmailFromTemplate(
    messageVersions: SibApiV3Sdk.SendSmtpEmailMessageVersions[],
    subject: string,
    plainTextMessage: string,
    htmlFileLocation: string,
  ) {
    // read the html
    // replace the template variables
    const htmlText = await this.templateService.getTemplate(
      htmlFileLocation,
      {},
      false,
    );

    // send the email
    const messageId = await this.sendBatchEmail(
      messageVersions,
      subject,
      plainTextMessage,
      htmlText,
    );

    return messageId;
  }
}
