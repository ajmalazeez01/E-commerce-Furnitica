const mongoose = require("mongoose");
const adminCollection = require("../models/adminSchema");
const userCollection = require("../models/userSchema");
const productCollection = require("../models/productSchema");
const categoryCollection = require("../models/categorySchema");

//admin get method
const loadLogin = (req, res) => {
  res.render("adminLogin");
};

const userLogin = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const userData = await adminCollection.findOne({ email: email });
  if (email == userData.email && password == userData.password) {
    res.redirect("/adminDashboard");
  } else {
    res.redirect("/adminlogin");
  }
};

//get  method
const amdinDasboard = (req, res) => {
  res.render("dashboard");
};

//user management find the user in the admin side
const user = async (req, res) => {
  try {
    let userData = await userCollection.find();

    res.render("userManagement", { userData: userData });
  } catch (error) {
    console.log(error);
  }
  res.render("userManagement");
};

//user management
const userBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await userCollection.findById({ _id: id });
    console.log(userdata);
    if (userdata.status == true) {
      await userCollection.updateOne({ _id: id }, { $set: { status: false } });
      res.redirect("/user");
    } else {
      await userCollection.updateOne({ _id: id }, { $set: { status: true } });
      res.redirect("/user");
    }
  } catch (error) {
    console.log(error);
  }
};

//product management find the datain the admin side
const product = async (req, res) => {
  try {
    const productData = await productCollection.find({});

    res.render("productManagement", { productData });
  } catch (error) {
    console.log(error);
  }
  res.render("productManagement");
};
//produtc management block and unbloxk
const productBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const productdata = await productCollection.findById({ _id: id });
    console.log(productdata);
    if (productdata.status == true) {
      await productCollection.updateOne(
        { _id: id },
        { $set: { status: false } }
      );
      res.redirect("/product");
    } else {
      await productCollection.updateOne(
        { _id: id },
        { $set: { status: true } }
      );
      res.redirect("/product");
    }
  } catch (error) {
    console.log(error);
  }
};
// add product
const insertProduct = (req, res) => {
  try {
    let product = new productCollection({
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      image: req.file.filename,
      price: req.body.price,
      stock: req.body.stock,
    });
    product.save();
    res.redirect("/product");
  } catch (error) {
    console.log(error);
  }
};

const editProduct = async (req, res) => {
  try {
    let id = req.query.id;
    const categoryData = await productCollection.findById({ _id: id });
    if (categoryData) {
      res.render("productManagement", { categoryData });
    } else {
      res.redirect("/product");
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteproduct = async (req, res) => {
  try {
    await productCollection.findByIdAndDelete({ _id: req.query.id });
    res.redirect("/product");
  } catch (error) {
    console.log(error);
  }
};

//category management find the datain the admin side
const category = async (req, res) => {
  try {
    console.log("haiii");

    const categoryData = await categoryCollection.find({});
    console.log(categoryData);

    res.render("categoryManagement", { categoryData });
  } catch (error) {
    console.log(error);
  }
  res.render("categoryManagement");
};

//category management block and unbloxk
const categoryBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const categoryData = await categoryCollection.findById({ _id: id });
    if (categoryData.status == true) {
      await categoryCollection.updateOne(
        { _id: id },
        { $set: { status: false } }
      );
      res.redirect("/category");
    } else {
      await categoryCollection.updateOne(
        { _id: id },
        { $set: { status: true } }
      );
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error);
  }
};
// add category
const insertCategory = async (req, res) => {
  try {
    console.log(req.body.name);

    let category = new categoryCollection({ name: req.body.name });
    console.log(category);
    await category.save();
    res.redirect("/category");
  } catch (error) {
    console.log(error);
  }
};

const editCategory = async (req, res) => {
  try {
    let id = req.query.id;
    const categoryData = await categoryCollection.findById({ _id: id });
    if (categoryData) {
      res.render("categoryManagement", { categoryData });
    } else {
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    await categoryCollection.findByIdAndDelete({ _id: req.query.id });
    res.redirect("/category");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadLogin,
  userLogin,
  amdinDasboard,
  user,
  userBlock,
  product,
  insertProduct,
  productBlock,
  editProduct,
  deleteproduct,
  category,
  categoryBlock,
  insertCategory,
  editCategory,
  deleteCategory,
};
