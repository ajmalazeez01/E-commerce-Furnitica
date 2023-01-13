// eslint-disable-next-line no-undef
const nodemailer=require("nodemailer")
// eslint-disable-next-line no-undef
require('dotenv').config()

// eslint-disable-next-line no-undef
module.exports={
    mailTransporter:nodemailer.createTransport({
        service:'gmail',
        auth:{
            // eslint-disable-next-line no-undef
            user: 'furnitica01@gmail.com',
            // eslint-disable-next-line no-undef
            pass: 'dtzcymaxtxzjgiop'
        },
    }),
    OTP:`${Math.floor(1000+Math.random()*9000)}`,
}

