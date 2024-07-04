const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.get("/", (req, res) => {
  res.send(`Namaste!`);
});

app.post("/send", (req, res) => {
  const { fisrtName, lastName, email, subject, message } = req.body;

  if (!fisrtName || !email || !subject) {
    return res.status(400).json("Enter an email address");
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: subject,
    text: `${message} 
    
Mail received from ${fisrtName} ${lastName}!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
