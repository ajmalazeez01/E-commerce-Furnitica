const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");
const cart = require("../controllers/cartController");
const session = require("../middleware/user/session");

//signup
router.get("/", userControllers.loadSignup);
router.post("/signup", userControllers.insertUser);

//otp
router.post("/otp", userControllers.otpvalidation);
router.get("/otp", userControllers.otp);

//login
router.post("/login", userControllers.userLogin);
router.get("/login", userControllers.login);

//home
router.get("/home", userControllers.userHome);

//home categoryproduct
router.get("/productlist", userControllers.productList);
router.get("/productdetail", userControllers.productDetail);

//cart
router.get("/cartlist", session.userLogin, cart.cartList);
router.post("/add_to_cart", session.userLogin, cart.add_to_cart);
router.patch("/productadd", session.userLogin, cart.productQtyAdd);
router.patch("/productsub", session.userLogin, cart.productQtySub);
router.get("/deletecart", session.userLogin, cart.deleteCart);

//checkout
router.get("/checkout", session.userLogin, cart.checkout);
router.post("/checkout", session.userLogin, cart.postCheckOut);

//wishlist
router.post("/wishlist", session.userLogin, cart.wishList);
router.get("/wishlist", session.userLogin, cart.view_wishList);
router.get("/deletewishlist", session.userLogin, cart.deleteWishlist);

//profile
router.get("/profile", session.userLogin, userControllers.profile);
router.post("/profile", session.userLogin, userControllers.insertProfile);

module.exports = router;
