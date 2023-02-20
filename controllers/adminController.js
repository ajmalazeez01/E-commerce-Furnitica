const adminCollection = require("../models/adminSchema");
const userCollection = require("../models/userSchema");
const productCollection = require("../models/productSchema");
const categoryCollection = require("../models/categorySchema");
const mongoose = require("mongoose");
const couponCollection = require("../models/couponSchema");
const orderCollection = require("../models/oderSchema");
const bannerCollection = require("../models/bannerSchema");
const moment = require("moment");
const excelJS = require("exceljs");

// admin get method
const loadLogin = (req, res) => {
  if (req.session.admin) {
    res.redirect("/adminDashboard");
  } else {
    res.render("adminLogin");
  }
};

const adminLogin = async (req, res) => {
  let { email, password } = req.body;
  const adminData = await adminCollection.findOne({ email: email });
  if (email == adminData.email && password == adminData.password) {
    req.session.admin = adminData._id;
    res.redirect("/adminDashboard");
  } else {
    res.render("adminLogin");
  }
};

const adminDashboard = async (req, res) => {
  try {
    const users = await userCollection.find().count();
    const productCount = await productCollection.find().count();
    const totalOrder = await orderCollection.find();
    const totalRevenue = totalOrder.reduce((acc, curr) => {
      acc = acc + curr.totalAmount;
      return acc;
    }, 0);
    const cancelOrder = await orderCollection
      .find({ orderStatus: "cancelled" })
      .count();
    const delivered = await orderCollection
      .find({ orderStatus: "delivered" })
      .count();
    const processing = await orderCollection
      .find({ orderStatus: "processing" })
      .count();
    const shipped = await orderCollection
      .find({ orderStatus: "shipped" })
      .count();
    res.render("dashboard", {
      users,
      productCount,
      cancelOrder,
      totalRevenue,
      delivered,
      shipped,
      processing,
    });
  } catch (error) {
    console.log(error);
  }
};

// user management
const user = async (req, res) => {
  try {
    await adminCollection.findOne({ _id: req.session.admin });
    const userData = await userCollection.find();
    res.render("userManagement", { userData });
  } catch (error) {
    console.log(error);
  }
};

// user management
const userBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await userCollection.findById({ _id: id });
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

// product management
const product = async (req, res) => {
  try {
    const data = req.query.wrong;
    const productData = await productCollection.find({});
    res.render("productManagement", { productData, data });
  } catch (error) {
    console.log(error);
  }
};

//insert product
const insertProduct = async (req, res) => {
  try {
    const name = req.body.name;
    let product = await productCollection.findOne({ name: name });
    if (product == undefined) {
      let newproduct = new productCollection({
        name: req.body.name,
        category: req.body.category,
        brand: req.body.brand,
        description: req.body.description,
        image: req.file.filename,
        price: req.body.price,
        stock: req.body.stock,
      });
      await newproduct.save();
      res.redirect("/product");
    } else {
      res.redirect("/product?wrong=product already exist");
    }
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

const postEditProduct = async (req, res) => {
  try {
    const id = req.query.id;
    if (req.file) {
      await productCollection.findByIdAndUpdate(
        { _id: id },
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

      res.redirect("/product");
    } else {
      await productCollection.findByIdAndUpdate(
        { _id: id },
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

// category management find the datain the admin side
const category = async (req, res) => {
  try {
    const data = req.query.wrong;
    const categoryData = await categoryCollection.find({});
    res.render("categoryManagement", { categoryData, data });
  } catch (error) {
    console.log(error);
  }
};

// category management block and unbloxk
const categoryBlock = async (req, res) => {
  try {
    const id = req.query.id;
    let categoryData = await categoryCollection.findById({ _id: id });
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
    const name = req.body.name.toUpperCase();
    const image = req.file.filename;
    const categoryExist = await categoryCollection.findOne({ name: name });
    if (categoryExist) {
      res.redirect("/category?wrong=category already exist");
    } else {
      const category = new categoryCollection({ name, image });
      await category.save();
      res.redirect("/category");
    }
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
    if (categoryData) {
      res.render("categoryEdit", { categoryData: categoryData, categoryDatas });
    } else {
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error);
  }
};



const postEditCategory = async (req, res) => {
  try {
    const id = req.query.id;
    if (req.file) {
      await categoryCollection.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            image: req.file.filename,
          },
        }
      );

      res.redirect("/category");
    } else {
      await categoryCollection.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
          },
        }
      );
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

//coupon manage
const couponManage = async (req, res) => {
  try {
    const data = req.query.wrong;
    const coupons = await couponCollection.find();
    res.render("couponManage", { coupons, data });
  } catch (error) {
    console.log(error);
  }
};

const insertCoupon = async (req, res) => {
  try {
    const code = req.body.code.toUpperCase();
    let couponCode = await couponCollection.findOne({ code: code });
    if (couponCode == undefined) {
      const newCoupon = new couponCollection({
        name: req.body.name,
        code: code,
        discount: req.body.discount,
        minAmount: req.body.minamount,
        startingDate: req.body.startingdate,
        expiryDate: req.body.expirydate,
      });
      newCoupon.save();
      res.redirect("/coupon");
    } else {
      res.redirect("/coupon?wrong=coupon already exist");
    }
  } catch (error) {
    console.log(error);
  }
};

const couponBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const productdata = await couponCollection.findById({ _id: id });
    // eslint-disable-next-line eqeqeq
    if (productdata.status == true) {
      await couponCollection.updateOne(
        { _id: id },
        { $set: { status: false } }
      );
      res.redirect("/coupon");
    } else {
      await couponCollection.updateOne({ _id: id }, { $set: { status: true } });
      res.redirect("/coupon");
    }
  } catch (error) {
    console.log(error);
  }
};

const orderManage = async (req, res) => {
  try {
    const orderDetails = await orderCollection.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          orderdate: "$orderDate",
          name: "$userData.name",
          totalamount: "$totalAmount",
          paymentmethod: "$paymentMethod",
          paymentstatus: "$paymentStatus",
          orderstatus: "$orderStatus",
          orderId: "$_id",
        },
      },
    ]);
    res.render("orderManage", { orderDetails });
  } catch (error) {
    console.log(error);
  }
};

const orderUpdate = async (req, res) => {
  try {
    let id = req.body.orderid;
    const status = req.body.orderstatus;
    await orderCollection.updateOne(
      { _id: id },
      { $set: { orderStatus: status } }
    );
    res.redirect("/ordermanage");
  } catch (error) {
    console.log(error);
  }
};

const viewOrder = async (req, res) => {
  try {
    let id = req.query.id;
    id = mongoose.Types.ObjectId(id);
    const productData = await orderCollection.aggregate([
      { $match: { _id: id } },
      { $unwind: "$orderItems" },
      {
        $project: {
          address: "$address",
          totalAmount: "$totalAmount",
          productId: "$orderItems.productId",
          productQty: "$orderItems.quantity",
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
    res.render("orderview", { productData });
  } catch (error) {
    console.log(error);
  }
};

const salesPage = async (req, res) => {
  try {
    const data = req.query.wrong;
    const orderDetails = await orderCollection.find({
      orderStatus: "delivered",
    });
    res.render("salesReport", { orderDetails, data });
  } catch (error) {
    console.log(error);
  }
};

const post_pdf_Data = async (req, res) => {
  try {
    let salesDate = req.body;
    let startDate = new Date(salesDate.from);

    let endDate = new Date(salesDate.to);
    if (endDate >= startDate) {
      let dateFrom = moment(salesDate.from).format("DD/MM/YYYY");
      let dateto = moment(salesDate.to).format("DD/MM/YYYY");

      const orderData = await orderCollection.find({
        $and: [
          { orderDate: { $gte: startDate, $lte: endDate } },
          { orderStatus: "delivered" },
        ],
      });
      const total = orderData.reduce((acc, curr) => {
        acc = acc + curr.totalAmount;
        return acc;
      }, 0);

      req.session.order = orderData;
      res.render("pdfDownload", { orderData, total });
    } else {
      res.redirect("/sales?wrong=invalid date");
    }
  } catch (error) {
    console.log(error);
  }
};

const csvDownload = async (req, res) => {
  try {
    const total = req.query.total;
    const saledata = req.session.order;
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Roport");
    worksheet.columns = [
      { header: "s no.", key: "s_no" },
      { header: "Order ID", key: "_id", width: 30 },
      { header: "Date", key: "Date", width: 15 },
      { header: "Order Status", key: "orderStatus", width: 15 },
      { header: "Payment Method", key: "paymentMethod", width: 15 },
      { header: "Total Amount", key: "totalAmount" },
      { header: "Grand Total", key: "total" },
    ];
    let counter = 1;
    let length = saledata.length;
    saledata.forEach((sale, i) => {
      let dateFrom = moment(sale.orderDate).format("DD/MM/YYYY");
      sale.Date = dateFrom;
      sale.s_no = counter;
      if (i == length - 1) {
        sale.total = total;
      }
      worksheet.addRow(sale);
      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales_Report.xlsx`
    );

    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error);
  }
};

const bannerManage = async (req, res) => {
  try {
    const data = req.query.wrong;
    const bannerDetails = await bannerCollection.find();
    res.render("bannerManage", { bannerDetails, data });
  } catch (error) {
    console.log(error);
  }
};

const addBanner = async (req, res) => {
  try {
    const name = req.body.name;
    let banner = await bannerCollection.findOne({ name: name });
    if (banner == undefined) {
      let newbanner = new bannerCollection({
        image: req.file.filename,
        name: req.body.name,
      });
      await newbanner.save();
      res.redirect("/banner");
    } else {
      res.redirect("/banner?wrong=banner already exist");
    }
  } catch (error) {
    console.log(error);
  }
};

const bannerBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const bannerData = await bannerCollection.findById({ _id: id });
    if (bannerData.status == true) {
      await bannerCollection.updateOne(
        { _id: id },
        { $set: { status: false } }
      );
      res.redirect("/banner");
    } else {
      await bannerCollection.updateOne({ _id: id }, { $set: { status: true } });
      res.redirect("/banner");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadLogin,
  adminLogin,
  adminDashboard,
  user,
  userBlock,
  product,
  insertProduct,
  // productBlock,
  editProduct,
  postEditProduct,
  deleteproduct,
  category,
  categoryBlock,
  insertCategory,
  editCategory,
  postEditCategory,
  deleteCategory,
  couponManage,
  insertCoupon,
  couponBlock,
  orderManage,
  orderUpdate,
  viewOrder,
  salesPage,
  post_pdf_Data,
  csvDownload,
  bannerManage,
  addBanner,
  bannerBlock,
};
