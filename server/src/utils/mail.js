import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: options.name,
      link: "https://mailgen.js/",
    },
  });
  // Generate an HTML email with the provided contents
const emailHtml = mailGenerator.generate(options.mailGenContent);

// Generate the plaintext version of the e-mail (for clients that do not support HTML)
const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_SMTP_HOST,
    port: process.env.MAIL_TRAP_SMTP_PORT,
    service: process.env.MAIL_TRAP_SMPT_SERVICE,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_TRAP_SMTP_USER,
      pass: process.env.MAIL_TRAP_SMTP_PASS,
    },
  });
  const mail={
    from: process.env.MAIL_TRAP_SMTP_USER, // sender address
    to: options.email, // list of receivers
    subject:options.subject, // Subject line
    text:emailText, // plain text body
    html: emailHtml, // html body
  }
  try {
    await transporter.sendMail(mail);
  } catch (   error) {
    console.error("email failed",error)
  }
};




const emailVerificatinMailGenContent=(username,verificationUrl)=>{
    return {
        body:{
            name:username,
            intro:"Welcome to our app",
            action: {
                instructions: 'To get started with our app, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'verify you email',
                    link: verificationUrl
                }
            },
             outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }

    }
}
const forgotPasswordMailGenContent=(username,resetPasswordUrl)=>{

    return {
        body:{
            name:username,
            intro:"we got a request to change your password",
            action: {
                instructions: 'To change your password click the button here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Password',
                    link: resetPasswordUrl
                }
            },
             outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }

    }
}

export{sendMail,emailVerificatinMailGenContent,forgotPasswordMailGenContent}