import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const sendMail = async (options: { email: string; subject: string; message: string }): Promise<void> => {
  await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525, // Ensure the port is a number
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'f9d4c771ed7680', // generated ethereal user
      pass: 'ced01935f03a2b', // generated ethereal password
    },
  } as SMTPTransport.Options); // Explicitly specify the options type

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Pramit Pal 👻" <pramitpal309@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });
};

export default sendMail;
