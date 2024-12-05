import nodemailer from 'nodemailer';


const sendEmail = async (email: string, subject: string, title: string, text: string): Promise<void> => {
  //connect to smtp server
  const transporter = nodemailer.createTransport({
    host: `process.env.SMTP_HOST`,
    port: parseInt(process.env.SMTP_PORT as string),
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: `"Maddison Foo Koch 👻" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text, // plain text body
    html: `<p>${title}</p>`, // html body
  });
}

export { sendEmail };