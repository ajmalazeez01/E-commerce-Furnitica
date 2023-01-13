const userCollection = require('../models/userSchema')
const productCollection=require('../models/productSchema')
const categoryCollection = require('../models/categorySchema')
const mailer = require('../utils/otp')
require('mongoose')
// const bcrypt = require('bcrypt')

const loadSignup = (req, res) => {
  res.render('signup')
// eslint-disable-next-line semi
};

let userData
const insertUser = async (req, res) => {
  // signup post
  try {
    userData = req.body
    const email = userData.email
    const paswword = userData.password
    const user = await userCollection.findOne({
      email : email
     })

    // eslint-disable-next-line eqeqeq
    if (email == user.email&&paswword == user.password ) {
      res.render('signup', { error: 'E-mail already exist' })
    }
  } catch (error) {
    console.log(req.body.email)
    const mailDetails = {
      from: 'ajmalazeez776@gmail.com',
      to: req.body.email,
      subject: 'Furnitica REGISTRATION',
      html: `<p>Your OTP for registering in furnitica is ${mailer.OTP}</p>`
    }
    console.log(mailer.OTP)
    mailer.mailTransporter.sendMail(mailDetails, (err, data) => {
      // console.log(data, '12345')
      if (err) {
        console.log(err, 'error')
      } else {
        res.render('../Views/otp.ejs')
        console.log('OTP mailed')
      }
    })
  }
}

const otp = (
  req,
  res // get method
) => {
  res.render('otp')
}

const otpvalidation = async (req,res) => {
  userotp = req.body.otp
  console.log(userotp);
  if (userotp == mailer.OTP)
  {
    const user = new userCollection({
     email: userData.email,
     name: userData.name,
     password: userData.password,
     number: userData.number,
      })
    const value = await user.save();
    res.redirect('/login')
  } else {
    
    res.render('otp', { wrong: 'otp is incorrect' })
  }
}

// login get
const login = (req, res) => {
  res.render('login',req.query)
}

// login post
const userLogin = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const userData = await userCollection.findOne({email : email})
    if(userData)
    {
      if(userData.status == true){
      if(userData.password == password){
        req.session.user=userData._id
        console.log(req.session.user);
        res.redirect('/home')
      }else{
        res.redirect('/login?wrong=email or pasword is inccorect')
      }
    } else {
        res.redirect('/login?wrong=email or pasword is inccorect2')
    } 
  } else {
        res.redirect('/login?wrong= pasword is inccorect')
  }

    
  } catch (error) {
      console.log(error);
  }
}


const userHome = async (req, res) => {
 try{
     const product = await productCollection.find({})
     const category = await categoryCollection.find({})
     res.render('userHome', {product, category})
    
 }
  
 catch (error) {
  console.log(error);
 }
}


const productList = async (req,res) =>{
  const product = await productCollection.find({category:req.query.category})
  res.render('productlist',{product})
  console.log(product);
 }

 const productDetail = async (req, res) =>{
  const product = await productCollection.findById({_id:req.query.id})
  res.render('productdetail',{product})
 
}




const checkoutList = (req, res) =>{
  res.render('checkout')
}



module.exports = {
  loadSignup,
  insertUser,
  otp,
  otpvalidation,
  login,
  userLogin,
  userHome,
  insertUser,
  productList,
  productDetail,
  checkoutList
}
