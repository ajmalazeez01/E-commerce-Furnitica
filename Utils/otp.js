const nodemailer=require("nodemailer")

module.exports={
    mailTransporter:nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'techinfobibin@gmail.com',
            pass:'lszmdwyfdhsoruyv'
        },
    }),
    OTP:`${Math.floor(1000+Math.random()*9000)}`,
}

