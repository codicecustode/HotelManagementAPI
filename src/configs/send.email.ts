import nodemailer from 'nodemailer';


const sendEmail = async (email: string, subject: string, text: string, html: string) => {
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
    from: `"Maddison Foo Koch 👻" <process.env.SMTP_FROM_EMAIL>`, // sender address
    to: `email`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
}

export { sendEmail };