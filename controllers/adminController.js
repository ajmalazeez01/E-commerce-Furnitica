// eslint-disable-next-line no-undef
const adminCollection = require('../models/adminSchema')
// eslint-disable-next-line no-undef
const userCollection = require('../models/userSchema')
// eslint-disable-next-line no-undef
const productCollection = require('../models/productSchema')
// eslint-disable-next-line no-undef
const categoryCollection = require('../models/categorySchema')
// eslint-disable-next-line no-undef, no-unused-vars
const mongoose = require('mongoose')
// admin get method
const loadLogin = (req, res) => {
  res.render("adminLogin");
};

const userLogin = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const userData = await adminCollection.findOne({ email:email });
  // eslint-disable-next-line eqeqeq
  if (email == userData.email && password == userData.password) {
    res.redirect("/adminDashboard");
  } else {
    res.redirect("/adminlogin");
  }
};

// get  method
const amdinDasboard = (req, res) => {
  res.render("dashboard");
};

// user management find the user in the admin side
const user = async (req, res) => {
  try {
    const userData = await userCollection.find();

    res.render("userManagement", { userData });
  } catch (error) {
    console.log(error);
  }
  res.render("userManagement");
};

// user management
const userBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await userCollection.findById({ _id: id });
    console.log(userdata);
    // eslint-disable-next-line eqeqeq
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

// product management find the datain the admin side
const product = async (req, res) => {
  try {
    const productData = await productCollection.find({});

    res.render("productManagement", { productData });
  } catch (error) {
    console.log(error);
  }
  res.render("productManagement");
};
// produtc management block and unbloxk
const productBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const productdata = await productCollection.findById({ _id: id });
    console.log(productdata);
    // eslint-disable-next-line eqeqeq
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
    // eslint-disable-next-line new-cap
    const product = new productCollection({
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
//edit get method
const editProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const productData = await productCollection.findById({ _id: id });
    const categoryData = await productCollection.find({});
    if (productData) {
      res.render("productEdit", { productData: productData, categoryData });
    } else {
      res.redirect("/product");
    }
  } catch (error) {
    console.log(error);
  }
};

//edit post method
const postEditProduct = async (req, res) => {
  try {
    const name = req.params.name;
    console.log(name);
    if (typeof req.file === "undefined") {
      const product = await productCollection.updateOne(
        { name: name },

        {
          $set: {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            brand: req.body.brand,
            stock: req.body.stock,
            price: req.body.price,
          },
        }
      );
      console.log(product);
      res.redirect("/product");
    } else {
      const product = await productCollection.updateOne(
        { name: name },

        {
          $set: {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            brand: req.body.brand,
            stock: req.body.stock,
            price: req.body.price,
            image: req.file.filename,
          },
        }
      );
      console.log(product);
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

// category management find the datain the admin side
const category = async (req, res) => {
  try {
    const categoryData = await categoryCollection.find({});
    console.log(categoryData);

    res.render("categoryManagement", { categoryData });
  } catch (error) {
    console.log(error);
  }
  res.render("categoryManagement");
};

// category management block and unbloxk
const categoryBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const categoryData = await categoryCollection.findById({ _id: id });
    // eslint-disable-next-line eqeqeq
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
    const name = req.body.name;
    const image = req.file.filename;
    const category = new categoryCollection({ name, image });
    console.log(category);
    await category.save();
    res.redirect("/category");
  } catch (error) {
    console.log(error);
  }
};

//edit get method
const editCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const categoryData = await categoryCollection.findById({ _id: id });
    const categoryDatas = await categoryCollection.find({});
    console.log(categoryData);
    if (categoryData) {
      res.render("categoryEdit", { categoryData: categoryData, categoryDatas });
    } else {
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error);
  }
};

//edit post method
const postEditCategory = async (req, res) => {
  try {
    const name = req.params.name;
    console.log(name);
    if (typeof req.file === "undefined") {
      const category = await categoryCollection.updateOne(
        { name: name },

        {
          $set: {
            name: req.body.name,
          },
        }
      );
      console.log(category);
      res.redirect("/category");
    } else {
      const category = await categoryCollection.updateOne(
        { name: name },

        {
          $set: {
            name: req.body.name,
            image: req.file.filename,
          },
        }
      );
      console.log(category);
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
// eslint-disable-next-line no-undef
module.exports =  {
  loadLogin,
  userLogin,
  amdinDasboard,
  user,
  userBlock,
  product,
  insertProduct,
  productBlock,
  editProduct,
  postEditProduct,
  deleteproduct,
  category,
  categoryBlock,
  insertCategory,
  editCategory,
  postEditCategory,
  deleteCategory,
};
