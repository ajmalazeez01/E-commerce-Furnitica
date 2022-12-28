const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();
const adminControllers = require("../controllers/adminController");
const multer = require("../middleware/multer");

router.get("/adminlogin", adminControllers.loadLogin);

router.post("/adminlogin", adminControllers.userLogin);

router.get("/adminDashboard", adminControllers.amdinDasboard);

router.get("/user", adminControllers.user);

router.get("/userblock", adminControllers.userBlock);

router.get("/category", adminControllers.category);

router.get("/categoryblock", adminControllers.categoryBlock);

router.get("/editcategory", adminControllers.editCategory);

router.get("/deletecategory", adminControllers.deleteCategory);

router.post("/insertcategory", adminControllers.insertCategory);

router.get("/product", adminControllers.product);

router.get("/productblock", adminControllers.productBlock);

router.post(
  "/insertproduct",
  multer.single("image"),
  adminControllers.insertProduct
);

router.get("/editproduct", adminControllers.editProduct);

router.get("/deleteproduct", adminControllers.deleteproduct);

// router.post('/productedit',adminControllers.productEdit)

module.exports = router;
