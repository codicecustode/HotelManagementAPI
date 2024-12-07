import nodemailer from 'nodemailer';


const sendEmail = async (email: string, subject: string, text: string, htmlMessage: string): Promise<void> => {
  
  const transporter = nodemailer.createTransport({
    service: `${process.env.GMAIL_SERVICE}`,
    auth: {
      user: `${process.env.GMAIL_USERNAME}`,
      pass: `${process.env.GMAIL_PASSWORD}`,
  }
  });

  const info = await transporter.sendMail({
    from: `"Maddison Foo Koch 👻" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: `${process.env.RECEIVER_MAIL}`, // list of receivers
    subject, // Subject line
    text, // plain text body
    html: `<a>${htmlMessage}</a>`, // html body
  });
  console.log('Message sent: %s', info.messageId);
}

export { sendEmail };