require('dotenv').config();

const fs = require('fs');
const path = require('path');

const nodemailer = require("nodemailer");

async function sendEmail(userEmail, role) {
  let transporter = nodemailer.createTransport({
    
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL, 
      pass: process.env.ADMIN_PASSWORD
    }
  });

  

  

  let templatePath;
  if (role === 1) {
    templatePath = path.join(__dirname, '../templates/AdminEmail.html');
  } else if (role === 2) {
    templatePath = path.join(__dirname, '../templates/VolunteerEmail.html');
  }

 
  let mailContent = fs.readFileSync(templatePath, 'utf8');

  let mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: userEmail,
    subject: 'Nouvel événement créé',
    text: mailContent,
    attachments: [{
       filename: "Alpha.png", 
       path: './src/templates/img/Alpha.png' }],
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}

module.exports = { sendEmail };
