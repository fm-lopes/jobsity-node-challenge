import * as nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer";

const transport = nodemailer.createTransport({
  host: "",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "AKIA2N3IN23NB6ESP7PE", // generated ethereal user
    pass: 'BNjxi9OQVPC8fAcnk28bIQvsycPqxUpEYeWxdyfPyqFQ', // generated ethereal password
  }
});

export const sendMail = (subject: string, html: string, to: string, _callback: any) => {
  const msg = {
    from: "Jobsity <felipelopes_7@hotmail.com>",
    to,
    cc: "",
    bcc: "",
    subject,
    html,
  };
  transport.sendMail(msg, (err: Error, info: SentMessageInfo) => {
    if (err) console.log(err);
    _callback(info);
  });
};
