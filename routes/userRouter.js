const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();
const userControllers = require("../controllers/userController");

router.get("/", userControllers.loadSignup);

router.post("/signup", userControllers.insertUser);

router.post("/otp", userControllers.otpvalidation);

router.get("/otp", userControllers.otp);

router.post("/login", userControllers.userLogin);

router.get("/login", userControllers.login);

router.get("/home", userControllers.userHome);

router.post("/signup", userControllers.insertUser);

router.post("/otp", userControllers.otpVerfication);

module.exports = router;
