// eslint-disable-next-line no-undef
const nodemailer=require("nodemailer")
// eslint-disable-next-line no-undef
require('dotenv').config()

// eslint-disable-next-line no-undef
module.exports={
    mailTransporter:nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: 'furnitica01@gmail.com',
            // USER: process.env.EMAIL,
            pass: 'dtzcymaxtxzjgiop'
            // pass: process.env.PASSWORD
        },
    }),
    OTP:`${Math.floor(1000+Math.random()*9000)}`,
}

