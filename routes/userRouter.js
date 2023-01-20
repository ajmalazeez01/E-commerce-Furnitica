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
//search
router.post("/search",userControllers.search);


//home categoryproduct
router.get("/productlist", userControllers.productList);
router.get("/productdetail", userControllers.productDetail);

//cart
router.get("/cartlist",session.userLogin,  cartControllers.cartList);
router.post("/add_to_cart",session.userLogin,  cartControllers.add_to_cart);
router.patch("/productadd",session.userLogin,  cartControllers.productQtyAdd);
router.patch("/productsub",session.userLogin,  cartControllers.productQtySub);
router.get("/deletecart",session.userLogin,  cartControllers.deleteCart);

//checkout
router.get("/checkout",session.userLogin,  cartControllers.checkout);
router.post("/checkout",session.userLogin,  cartControllers.postCheckOut);
router.post("/setaddress",session.userLogin,  cartControllers.setAddressCheckout);

//wishlist
router.post("/wishlist",session.userLogin,  cartControllers.wishList);
router.get("/wishlist",session.userLogin,  cartControllers.view_wishList);
router.get("/deletewishlist",session.userLogin,  cartControllers.deleteWishlist);

//profile
router.get("/profile",userControllers.profile);
router.post("/profile",userControllers.insertProfile);
router.get("/editaddress",userControllers.editAddress);
router.post("/editaddress",userControllers. posteditAddress);
router.get("/deleteaddress",userControllers.deleteAddress);

//coupon 
router.post("/couponcheck",session.userLogin,cartControllers.couponCheck);

//order
router.get("/order",userControllers.orderPage);
router.get("/orderdetails",userControllers.viewOrderDetails);
router.get("/cancelorder",userControllers.cancelOrder);


//payment
router.get("/success", cartControllers.success);
router.get("/failed", cartControllers.failed);

//contact
router.get("/contact", userControllers.contact);

//error page
router.get("/404", userControllers.errorPage);

module.exports = router;

//session.userLogin,