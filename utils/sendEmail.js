const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email),
      (this.firstName = user.username),
      (this.url = url),
      (this.from = `Gaurav Bhardwaj <${process.env.EMAIL_FROM}>`);
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "sendinblue",
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        user: this.to,
        url: this.url,
        subject,
      }
    );

    const mailOption = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOption);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Onlypost! Share post with world");
  }

  async sendPassToken() {
    await this.send(
      "passReset",
      "Your password reset token (valid for 10mins only)"
    );
  }
};

// const sendEmail = (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   transporter.sendMail(mailOption);
// };

// module.exports = sendEmail;
