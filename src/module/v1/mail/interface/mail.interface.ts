export interface ISendMail {
  to: string;
  subject: string;
  template: any;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }[];
}
