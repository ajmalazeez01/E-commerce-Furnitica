// eslint-disable-next-line no-undef
const userCollection = require("../models/userSchema");
// eslint-disable-next-line no-undef
const productCollection = require("../models/productSchema");
// eslint-disable-next-line no-undef
const categoryCollection = require("../models/categorySchema");
// eslint-disable-next-line no-undef
const mongoose = require("mongoose");
// eslint-disable-next-line no-undef, no-unused-vars
const nodemailer = require("../utils/otp");
const orderCollection = require("../models/oderSchema");

const loadSignup = (req, res) => {
  res.render("signup");
  // eslint-disable-next-line semi
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
    // eslint-disable-next-line eqeqeq
    if (email == user.email && password == user.password) {
      if (password !== cpassword) {
        res.render("signup", { warning: "incorrect password" });
      }
      res.render("signup", { error: "you have already in member" });
    }
  } catch (error) {
    const mailDetails = {
      from: "ajmalazeez776@gmail.com",
      to: req.body.email,
      subject: "Furnitica REGISTRATION",
      // eslint-disable-next-line no-undef
      html: `<p>Your OTP for registering in furnitica is ${nodemailer.OTP}</p>`,
    };
    console.log(nodemailer.OTP);

    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-undef
    nodemailer.mailTransporter.sendMail(mailDetails, (err) => {
      if (err) {
        console.log(err, "error");
      } else {
        res.render("otp.ejs");
        console.log("OTP mailed");
      }
    });
  }
};

const otp = (
  req,
  res // get method
) => {
  res.render("otp");
};

const otpvalidation = async (req, res) => {
  // eslint-disable-next-line no-undef
  userotp = req.body.otp;
  // eslint-disable-next-line no-undef
  if (nodemailer.OTP == userotp) {
    const user = new userCollection({
      email: userData.email,
      name: userData.name,
      password: userData.password,
      number: userData.number,
    });
    // eslint-disable-next-line no-unused-vars
    const value = await user.save();
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
    const userData = await userCollection.findOne({ email: email });
    if (userData) {
      if (userData.status == true) {
        if (userData.password == password) {
          req.session.user = userData._id;
          res.redirect("/");
        } else {
          res.redirect("/login?wrong=email or pasword is inccorect");
        }
      } else {
        res.redirect("/login?wrong=email or pasword is inccorect2");
      }
    } else {
      res.redirect("/login?wrong= pasword is inccorect");
    }
  } catch (error) {
    console.log(error);
  }
};

const userHome = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.session.user);
    const userName = await userCollection.findOne({ _id: id });
    const product = await productCollection.find({
      // product: req.query.id, status : true
    });
    const category = await categoryCollection.find({
      category: req.query.category,
      status: true,
    });

    res.render("userHome", { product, category, userName });
  } catch (error) {
    console.log(error);
  }
};

const productList = async (req, res) => {
  const product = await productCollection.find({
    category: req.query.category,
    status: true,
  });
  res.render("productList", { product });
};

const productDetail = async (req, res) => {
  const product = await productCollection.findById({ _id: req.query.id });
  res.render("productDetail", { product });
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
      {
        $sort: { status: -1 },
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

//post edit profile address
// const posteditAddress = async (req, res) => {
//   try {
//     const name = req.params.name;
//     console.log(name);
//     {
//       await userCollection.updateOne(
//         { name: name },

//         {
//           $set: {
//             name: req.body.name,
//             addressline1: req.body.addressline1,
//             addressline2: req.body.addressline2,
//             district: req.body.district,
//             state: req.body.state,
//             country: req.body.country,
//             pin: req.body.pin,
//             mobile: req.body.mobile,
//           },
//         }
//       );
//       res.redirect("/profile");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

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
    res.render("orderPage", { order, brands, categories, user });
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

    res.render("orderDetail", { productData, brands, categories, user });
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
  productList,
  productDetail,
  profile,
  insertProfile,
  editAddress,
  posteditAddress,
  deleteAddress,
  orderPage,
  viewOrderDetails,
  errorPage,
};
