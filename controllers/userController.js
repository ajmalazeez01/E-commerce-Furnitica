const userCollection = require("../models/userSchema");
const productCollection = require("../models/productSchema");
const categoryCollection = require("../models/categorySchema");
const mongoose = require("mongoose");
const nodemailer = require("../utils/otp");
const orderCollection = require("../models/oderSchema");
const bannerCollection = require("../models/bannerSchema");
const cartCollection = require("../models/cartSchema");

const loadSignup = (req, res) => {
  res.render("signup");
};

let userData;
const insertUser = async (req, res) => {
  // signup post
  try {
    userData = req.body;
    const email = userData.email;
    const password = userData.password;
    const cpassword = userData.cpassword;
    const user = await userCollection.findOne({ email: email });
    if (email == user.email && password == user.password) {
      if (password !== cpassword) {
        res.render("signup", { warning: "incorrect password" });
      }
      res.render("signup", { error: "you already have a member" });
    }
  } catch (error) {
    const mailDetails = {
      from: "ajmalazeez776@gmail.com",
      to: req.body.email,
      subject: "Furnitica REGISTRATION",
      html: `<p>Your OTP for registering in furnitica is ${nodemailer.OTP}</p>`,
    };
    console.log(nodemailer.OTP);

    nodemailer.mailTransporter.sendMail(mailDetails, (err) => {
      if (error) {
        console.log(error);
      } else {
        res.render("otp");
        console.log("OTP mailed");
      }
    });
  }
};

const otp = (req, res) => {
  res.render("otp");
};

const otpvalidation = async (req, res) => {
  userotp = req.body.otp;
  if (nodemailer.OTP == userotp) {
    const user = new userCollection({
      email: userData.email,
      name: userData.name,
      password: userData.password,
      number: userData.number,
    });
    await user.save();
    res.redirect("/login");
  } else {
    res.render("otp", { wrong: "otp is incorrect" });
  }
};

// login get
const login = (req, res) => {
  res.render("login", req.query);
};

// login post
const userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await userCollection.findOne({ email });
    if (userData) {
      if (userData.status == true) {
        if (userData.password == password) {
          req.session.user = userData._id;
          res.redirect("/");
        } else {
          res.redirect("/login?wrong=password is inccorect");
        }
      } else {
        res.redirect("/login?wrong=user is blocked");
      }
    } else {
      res.redirect("/login?wrong=username and pasword is inccorect");
    }
  } catch (error) {
    console.log(error);
  }
};

const userHome = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.session.user);
    const userName = await userCollection.findOne({ _id: id });
    var bannerDetails = await bannerCollection.find({});
    const product = await productCollection.find({});
    const cartCount = await cartCollection.findOne({
      userId: mongoose.Types.ObjectId(req.session.user),
    });
    const category = await categoryCollection.find({
      category: req.query.category,
      status: true,
    });
    res.render("userHome", {
      product,
      category,
      userName,
      bannerDetails,
      cartCount,
    });
  } catch (error) {
    console.log(error);
  }
};

const search = async (req, res) => {
  try {
    const user = await userCollection.findOne({ _id: req.session.user });
    const categories = await categoryCollection.find({ status: true });
    const brands = await productCollection.find({ status: true });
    await productCollection.findOne({ _id: req.session.user });
    const cartCount = await cartCollection.findOne({
      userId: mongoose.Types.ObjectId(req.session.user),
    });
    // const product = await productCollection.find({
    //   category: req.query.category,
    //   status: true,
    // });
    const key = req.body.search;
    const product = await productCollection.find({
      $or: [{ name: new RegExp(key, "i") }],
    });
    if (product.length) {
      res.render("productList", {
        user,
        categories,
        brands,
        product,
        cartCount,
      });
    } else {
      res.render("productList", {
        user,
        categories,
        brands,
        product,
        message: "Ooops ...! No Match",
        cartCount,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const productList = async (req, res) => {
  const cartCount = await cartCollection.findOne({
    userId: mongoose.Types.ObjectId(req.session.user),
  });
  const product = await productCollection.find({
    category: req.query.category,
    status: true,
  });
  res.render("productList", { product, cartCount });
};

const productDetail = async (req, res) => {
  const cartCount = await cartCollection.findOne({
    userId: mongoose.Types.ObjectId(req.session.user),
  });
  const product = await productCollection.findById({ _id: req.query.id });
  res.render("productDetail", { product, cartCount });
};

//insert profile
const profile = async (req, res) => {
  try {
    const userDetails = await userCollection.findById({
      _id: req.session.user,
    });
    const brands = await productCollection.distinct("brand");
    const categories = await categoryCollection.find({ status: true });
    const user = await userCollection.findOne({ _id: req.session.user });
    const userName = await userCollection.find({ _id: req.session.user });
    const cartCount = await cartCollection.findOne({
      userId: mongoose.Types.ObjectId(req.session.user),
    });
    const address = await userCollection.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
      { $unwind: "$address" },
      {
        $project: {
          name: "$address.name",
          addressline1: "$address.addressline1",
          addressline2: "$address.addressline2",
          district: "$address.district",
          state: "$address.state",
          country: "$address.country",
          pin: "$address.pin",
          mobile: "$address.mobile",
          _id: "$address._id",
          status: "$address.status",
        },
      },
    ]);
    const wrong = req.query.wrong;
    const success = req.query.success;
    res.render("profile", {
      brands,
      categories,
      address,
      user,
      userName,
      userDetails,
      wrong,
      success,
      cartCount,
    });
  } catch (error) {
    console.log(error);
  }
};

// address addd
let insertProfile = async (req, res) => {
  try {
    await userCollection.updateOne(
      { _id: req.session.user },
      {
        $push: {
          address: {
            name: req.body.name,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin,
            mobile: req.body.mobile,
          },
        },
      },
      { upsert: true }
    );
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
};

let id;
//get edit profile address
const editAddress = async (req, res) => {
  try {
    id = req.query.id;
    const address = await userCollection.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
      { $unwind: "$address" },
      {
        $project: {
          name: "$address.name",
          addressline1: "$address.addressline1",
          addressline2: "$address.addressline2",
          district: "$address.district",
          state: "$address.state",
          country: "$address.country",
          pin: "$address.pin",
          mobile: "$address.mobile",
          _id: "$address._id",
          status: "$address.status",
        },
      },
      { $match: { _id: mongoose.Types.ObjectId(id) } },
    ]);
    res.render("editAddress", { address: address });
  } catch (error) {
    console.log(error);
  }
};

var posteditAddress = async (req, res) => {
  try {
    id = req.query.id;
    const EditData = await userCollection.find(
      { _id: req.session.user },
      { address: { $elemMatch: { _id: req.query.id } } }
    );
    const brands = await productCollection.distinct("brand");
    const categories = await categoryCollection.find({ status: true });
    const address = await userCollection.findOne({ _id: req.session.user });
    res.render("editAddress", {
      brands,
      categories,
      EditData,
      address,
    });
  } catch (error) {
    console.log(error);
  }
};


//delete address
let deleteAddress = async (req, res) => {
  try {
    await userCollection.updateOne(
      { _id: req.session.user },
      { $pull: { address: { _id: req.query.id } } }
    );
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
};

const orderPage = async (req, res) => {
  try {
    const brands = await productCollection.distinct("brand");
    const categories = await categoryCollection.find({ status: true });
    const user = await userCollection.findOne({ _id: req.session.user });
    const order = await orderCollection.find({ userId: req.session.user });
    const cartCount = await cartCollection.findOne({
      userId: mongoose.Types.ObjectId(req.session.user),
    });
    res.render("orderPage", { order, brands, categories, user, cartCount });
  } catch (error) {
    console.log(error);
  }
};

const viewOrderDetails = async (req, res) => {
  try {
    let id = req.query.id;
    id = mongoose.Types.ObjectId(id);
    const brands = await productCollection.distinct("brand");
    const categories = await categoryCollection.find({ status: true });
    const user = await userCollection.findOne({ _id: req.session.user });
    const cartCount = await cartCollection.findOne({
      userId: mongoose.Types.ObjectId(req.session.user),
    });
    const productData = await orderCollection.aggregate([
      { $match: { _id: id } },
      { $unwind: "$orderItems" },
      {
        $project: {
          address: "$address",
          totalAmount: "$totalAmount",
          productId: "$orderItems.productId",
          productQty: "$orderItems.quantity",
          orderStatus: "$orderStatus",
        },
      },
      {
        $lookup: {
          from: "poducts",
          localField: "productId",
          foreignField: "_id",
          as: "data",
        },
      },
      { $unwind: "$data" },
      {
        $project: {
          address: "$address",
          totalAmount: "$totalAmount",
          productQty: "$productQty",
          orderStatus: "$orderStatus",
          image: "$data.image",
          name: "$data.name",
          brand: "$data.brand",
          price: "$data.price",
        },
      },
      {
        $addFields: {
          total: { $multiply: ["$productQty", "$price"] },
        },
      },
    ]);
    res.render("orderDetail", {
      productData,
      brands,
      categories,
      user,
      cartCount,
    });
  } catch (error) {
    console.log(error);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const id = req.query.id;
    const order = await orderCollection.find({ userId: req.session.user });
    await orderCollection.updateOne(
      { _id: id },
      { $set: { orderStatus: "cancel" } }
    );
    res.redirect("/orderdetails?id=" + id);
  } catch (error) {
    console.log(error);
  }
};

const contact = async (req, res) => {
  try {
    const cartCount = await cartCollection.findOne({
      userId: mongoose.Types.ObjectId(req.session.user),
    });
    res.render("contact", { cartCount });
  } catch (error) {
    console.log(error);
  }
};

const about = async (req, res) => {
  try {
    const cartCount = await cartCollection.findOne({
      userId: mongoose.Types.ObjectId(req.session.user),
    });
    res.render("about", { cartCount });
  } catch (error) {
    console.log(error);
  }
};

const errorPage = (req, res) => {
  try {
    res.render("errorPage");
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
  search,
  contact,
  about,
  productList,
  productDetail,
  profile,
  insertProfile,
  editAddress,
  posteditAddress,
  deleteAddress,
  orderPage,
  viewOrderDetails,
  cancelOrder,
  errorPage,
};
