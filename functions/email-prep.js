require("dotenv").config();
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const OAuth2 =google.auth.OAuth2;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

exports.sendMail= async (mailOptions)=>{
  try {
    console.log("email send first");
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    console.log("email send second");
    const results = await transporter.sendMail(mailOptions);
    return results;
  } catch (error) {
    return error;
  }
};

/*
const mailOptions ={
  // from: newEmailDataSend.email,
  to: process.env.EMAIL,
  subject: `New Text Message `,
  text: `Only text meassage`,

};

exports.emailTransporter = transporter
    .sendMail(mailOptions, async (error, data)=>{
      if (error) {
        console.log("error has occurred", error);
      } else {
        console.log("message was sent successful");
      }
    });

*/
