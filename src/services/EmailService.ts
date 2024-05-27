require('dotenv').config();

const fs = require('fs');
const path = require('path');

const nodemailer = require("nodemailer");

async function sendEmail(userEmail, role, eventAction) {
  let transporter = nodemailer.createTransport({
    
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL, 
      pass: process.env.ADMIN_PASSWORD
    }
  });

  

  let templatePath;
  

  if (role === 1) {
    if (eventAction === 'created') {
      templatePath = path.join(__dirname, '../templates/AdminEmail.html');
     
    } else {
      templatePath = path.join(__dirname, '../templates/AdminUpdateEmail.html');
     
    }
  } else if (role === 2) {
    if (eventAction === 'created') {
      templatePath = path.join(__dirname, '../templates/VolunteerEmail.html');
     
    } else {
      templatePath = path.join(__dirname, '../templates/VolunteerUpdateEmail.html');
    
    }
  }

 
  let mailContent = fs.readFileSync(templatePath, 'utf8');

  let mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: userEmail,
    subject: 'Alpha project vous informe',
    html: mailContent,
    attachments: [{
       filename: "Alpha.png", 
       path: './src/templates/img/Alpha.png' }],
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}

module.exports = { sendEmail };
