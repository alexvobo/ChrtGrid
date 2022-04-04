const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);

    const form = data["form"];
    const inquiryType = data["inquiry"];

    if (
      !form ||
      !form?.name ||
      !form?.email ||
      !form?.question ||
      !form?.subject ||
      !inquiryType
    ) {
      return res.status(400).json({ status: "form error" });
    }
    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const transporter = nodemailer.createTransport({
      port: 587,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
      secureConnection: true,
    });

    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailData = {
      from: process.env.NODEMAILER_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: `[#${inquiryType}] | ${form.subject}`,
      text: JSON.stringify(form),
      html: `
        <div>
          <div>
          <h1>[#${inquiryType}] | ${form.subject}</h1>
          <hr/>
            <ol style="font-size:medium;">
                <li>
                <span style="font-weight:bold; ">Name</span>:
                ${form.name}
                </li>
                <li>
                <span style="font-weight:bold; ">Email</span>:
                ${form.email}
                </li>
                <li>
                <span style="font-weight:bold; ">Twitter</span>:
                ${form?.twitter}
                </li>
                <li>
                <span style="font-weight:bold; ">Wallet</span>:
                ${form?.wallet}
                </li>
                <li>
                <span style="font-weight:bold; ">IP</span>:
                ${ip}
                </li>
                <li>
                <span style="font-weight:bold; ">Question</span>:
                <br>
                ${form.question}
                </li>
            </ol>
          </div>
        </div>`,
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
          return res.status(400).json({ status: "Error" });
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
    return res.status(200).json({ status: "submitted" });
  }
  return res.status(500).json({ status: "POST only" });
}
