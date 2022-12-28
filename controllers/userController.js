const userCollection = require("../models/userSchema");
const mailer = require("../Utils/otp");
const nodemailer = require("nodemailer");

const loadSignup = (req, res) => {
  res.render("signup");
};

let userData;
const insertUser = async (req, res) => {
  //signup post
  try {
    userData = req.body;
    const email = req.body.email;
    const user = await userCollection.findOne({ email: email });

    if (email == user.email) {
      res.render("signup", { error: "E-mail already exist" });
    }
  } catch (error) {
    console.log(req.body.email);
    let mailDetails = {
      from: "ajmalazeez776@gmail.com",
      to: req.body.email,
      subject: "fashions REGISTRATION",
      html: `<p>Your OTP for registering in fashions is ${mailer.OTP}</p>`,
    };
    console.log(mailer.OTP);
    mailer.mailTransporter.sendMail(mailDetails, (err, data) => {
      console.log(data, "12345");
      if (err) {
        console.log(err, "error");
      } else {
        res.render("../Views/otp.ejs");
        console.log("OTP mailed");
      }
    });
  }
};

const otp = (
  req,
  res //get method
) => {
  res.render("otp");
};

const otpvalidation = async (
  req,
  res //post method
) => {
  userotp = req.body.otp;
  if (userotp == mailer.OTP) {
    await userCollection.insertMany([
      //database save method

      userData,
    ]);
    res.redirect("/login");
  } else {
    res.render("otp", { wrong: "otp is incorrect" });
  }
};

const login = (
  req,
  res //login get
) => {
  res.render("login");
};

const userLogin = async (
  req,
  res //login post
) => {
  const email = req.body.email;
  const password = req.body.password;
  const userData = await userCollection.findOne({ email: email });
  if (email == userData.email && password == userData.password) {
    res.redirect("/home");
  } else {
    res.redirect("/login", { wrong: "otp is incorent haiii" });
  }
};

const userHome = (
  req,
  res //get home
) => {
  res.render("userHome");
};

const otpVerfication = async (req, res) => {
  try {
    if (req.body.otp == mailer.OTP) {
      console.log(userData.email);
      const user1 = new userCollection(userData);
      user1.save();
      res.redirect("/");
    } else {
      res.render("../Views/user/otp.ejs", { error: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
  }
  // res.render("../Views/user/otp.ejs")`
};

const userVerification = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await userCollection.findOne({ email: req.body.email });
    if (user) {
      if (email == user.email && password == user.password) {
        // console.log(user.email);
        res.redirect("/userhome");
      } else {
        res.render("../Views/userLogin.ejs", {
          wrong: "Invalid Email or password",
        });
      }
    } else {
      res.render("../Views/userLogin.ejs", { wrong: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadSignup,
  insertUser,
  otp,
  otpvalidation,
  login,
  userLogin,
  userHome,
  insertUser,
  otpVerfication,
  userVerification,
};
