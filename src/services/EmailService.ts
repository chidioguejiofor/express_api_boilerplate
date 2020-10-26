import sgMail from "@sendgrid/mail";

abstract class BaseEmailService {
  abstract html: string;
  abstract from: string;
  abstract subject: string;
  abstract text?: string;

  public abstract sendEmail(to: string | string[]): void;
}

export class SendGridMailService extends BaseEmailService {
  SG_SERVICE = sgMail;

  html: string;
  from: string;
  subject: string;
  text?: string;

  constructor(html: string, subject: string, text?: string) {
    super();
    this.subject = subject;
    this.html = html;
    (this.from = "info@syca.com"), (this.text = text);
  }

  public sendEmail = async (to: string | string[]): Promise<boolean> => {
    console.log(process.env.SENDGRID_API_KEY);
    this.SG_SERVICE.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: this.from,
      subject: this.subject,
      text: this.text,
      html: this.html,
    };

    try {
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}
