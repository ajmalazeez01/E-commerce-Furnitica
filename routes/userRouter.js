const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");
const cartControllers = require("../controllers/cartController");
const session = require("../middleware/user/session");

//signup
router.get("/signup", userControllers.loadSignup);
router.post("/signup", userControllers.insertUser);

//otp
router.post("/otp", userControllers.otpvalidation);
router.get("/otp", userControllers.otp);

//login
router.post("/login", userControllers.userLogin);
router.get("/login", userControllers.login);

//home
router.get("/", userControllers.userHome);

//home categoryproduct
router.get("/productlist", userControllers.productList);
router.get("/productdetail", userControllers.productDetail);

//cart
router.get("/cartlist",  cartControllers.cartList);
router.post("/add_to_cart",  cartControllers.add_to_cart);
router.patch("/productadd",  cartControllers.productQtyAdd);
router.patch("/productsub",  cartControllers.productQtySub);
router.get("/deletecart",  cartControllers.deleteCart);

//checkout
router.get("/checkout",  cartControllers.checkout);
router.post("/checkout",  cartControllers.postCheckOut);
router.post("/setaddress",  cartControllers.setAddressCheckout);

//wishlist
router.post("/wishlist",  cartControllers.wishList);
router.get("/wishlist",  cartControllers.view_wishList);
router.get("/deletewishlist",  cartControllers.deleteWishlist);

//profile
router.get("/profile",  userControllers.profile);
router.post("/profile",  userControllers.insertProfile);
router.get("/editaddress",userControllers.editAddress);
router.post("/editaddress",userControllers. posteditAddress);
router.get("/deleteaddress",userControllers.deleteAddress);

//coupon 
router.post("/couponcheck",cartControllers.couponCheck);

//order
router.get("/order",userControllers.orderPage);
router.get("/orderdetails",userControllers.viewOrderDetails);

//payment
router.get("/success", cartControllers.success);
router.get("/failed", cartControllers.failed);

//error page
router.get("/404", userControllers.errorPage);

module.exports = router;

//session.userLogin,