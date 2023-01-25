const productCollection = require("../models/productSchema");
const categoryCollection = require("../models/categorySchema");
const cartCollection = require("../models/cartSchema");
const mongoose = require("mongoose");
const wishlistCollection = require("../models/wishlistSchema");
const orderCollection = require("../models/oderSchema");
const userCollection = require("../models/userSchema");
const couponCollection = require("../models/couponSchema");
const paypal = require("paypal-rest-sdk");

let cartCount;
//get method
const cartList = async (req, res) => {
  try {
    const user = await userCollection.findOne({ _id: req.session.user });
    const brands = await productCollection.distinct("brand");
    const categories = await categoryCollection.find({ status: true });
    const cartCount=await cartCollection.findOne({userId: mongoose.Types.ObjectId(req.session.user)})
    const cartData = await cartCollection.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },

      { $unwind: "$cartItem" },
      {
        $project: {
          productId: "$cartItem.productId",
          qty: "$cartItem.qty",
          userId: "$userId",
        },
      },

      {
        $lookup: {
          from: "poducts",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          name: "$productDetails.name",
          price: "$productDetails.price",
          image: "$productDetails.image",
          description: "$productDetails.description",
          qty: "$qty",
          id: "$productDetails._id",
          userId: "$userId",
        },
      },
      {
        $addFields: {
          total: { $multiply: ["$price", "$qty"] },
        },
      },
    ]);
    
    const subtotal = cartData.reduce(function (acc, curr) {
      acc = acc + curr.total;
      return acc;
    }, 0);
    res.render("cart", {
      brands,
      categories,
      cartData,
      user,
      subtotal,
      cartCount
    });
  } catch (error) {
    console.log(error);
  }
};
//get method cart product check
const add_to_cart = async (req, res) => {
  try {
    const proId = req.body.Id;
    // eslint-disable-next-line no-unused-vars
    const Id = mongoose.Types.ObjectId(proId);
    const productData = await productCollection.findOne({ _id: proId });
    const id = mongoose.Types.ObjectId(req.session.user);
    if (productData.stock > 0) {
      const cartExist = await cartCollection.findOne({ userId: id });
      if (cartExist) {
        const exist1 = await cartCollection.aggregate([
          {
            $match: {
              $and: [
                { userId: mongoose.Types.ObjectId(req.session.user) },
                {
                  cartItem: {
                    $elemMatch: {
                      productId: new mongoose.Types.ObjectId(proId),
                    },
                  },
                },
              ],
            },
          },
        ]);
        if (exist1.length === 0) {
          await cartCollection.updateOne(
            { userId: id },
            {
              $push: { cartItem: { productId: proId } },
            }
          );
          const cartData = await cartCollection.findOne({ userId: id });
          const count = cartData.cartItem.length;
          res.json({ success: true, count });
        } else {
          res.json({ exist: true });
        }
      } else {
        const addCart = new cartCollection({
          userId: id,
          cartItem: [{ productId: proId }],
        });
        await addCart.save();
        const cartData = await cartCollection.findOne({ userId: id });
        const count = cartData.cartItem.length;
        //  console.log(count);
        res.json({ success: true, count });
      }
    } else {
      res.json({ outofStock: true });
    }
  } catch (error) {
    console.log(error);
  }
};


const productQtyAdd = async (req, res) => {
  try {
    const data=req.body
    const proId=data.Id
    const qty=parseInt(data.qty)
    const productData=await productCollection.findOne({_id:proId})
    if (productData.stock>qty ){
          const price=productData.price
          await cartCollection.updateOne(
               { userId: req.session.user, "cartItem.productId": proId },
               { $inc: { "cartItem.$.qty": 1 } })
              res.json({price})
    }else{
      res.json({outStock:true})
    }
  } catch (error) {
    console.log(error);
  }
};

const productQtySub = async (req, res) => {
  try {
    const data=req.body
    const proId=data.Id
    const qty=parseInt(data.qty)
    console.log(data.qty);
    const productData=await productCollection.findOne({_id:proId})
    if (productData.stock>0 ){
         if( qty > 1){
          const price=productData.price
          await cartCollection.updateOne(
               { userId: req.session.user, "cartItem.productId": proId },
               { $inc: { "cartItem.$.qty": -1 } })
              res.json({price})
         }else{
          res.json({limit:true})
         }
    }else{
      res.json({outStock:true})
    }
  } catch (error) {
    console.log(error);
  }
};


const deleteCart = async (req, res) => {
  try {
    const userId = req.session.user;
    const id = req.query.id;
    await cartCollection.updateOne(
      { userId: userId },
      { $pull: { cartItem: { productId: id } } }
    );
    res.redirect("/cartlist");
  } catch (error) {
    console.log(error);
  }
};

const view_wishList = async (req, res) => {
  try {
    const user = await userCollection.findOne({ _id: req.session.user });
    // const brands = await productCollection.distinct("brand");
    const categories = await categoryCollection.find({ status: true });
    const wishList = await wishlistCollection.aggregate([
      { $match: { userId: user._id } },
      { $unwind: "$wishList" },
      {
        $project: {
          productId: "$wishList.productId",
          qty: "$wishList.qty",
        },
      },
      {
        $lookup: {
          from: "poducts",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          name: "$productDetails.name",
          price: "$productDetails.price",
          image: "$productDetails.image",
          qty: "$qty",
          id: "$productDetails._id",
        },
      },
      {
        $addFields: {
          total: { $multiply: ["$price", "$qty"] },
        },
      },
    ]);
    res.render("wishlist", { user, categories, wishList });
  } catch (error) {
    console.log(error);
  }
};

const wishList = async (req, res) => {
  try {
    const data = req.body;
    const id = data.prodId;
    const userId = req.session.user;
    const Id = mongoose.Types.ObjectId(userId);
    const wish = await wishlistCollection.findOne({ userId: Id });
    if (wish) {
      let wishlistEx = wish.wishList.findIndex(
        (wishList) => wishList.productId == id
      );
      if (wishlistEx != -1) {
        res.json({ wish: true });
      } else {
        await wishlistCollection.updateOne(
          { userId: Id },
          {
            $push: { wishList: { productId: id } },
          }
        );
        const wishlistData = await wishlistCollection.findOne({ userId: Id });
        const count = wishlistData.wishList.length;
        res.json({ success: true, count });
      }
    } else {
      const addWish = new wishlistCollection({
        userId: userId,
        wishList: [{ productId: id }],
      });
      await addWish.save();
      const wishlistData = await wishlistCollection.findOne({ userId: Id });
      const count = wishlistData.wishList.length;
      res.json({ success: true, count });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const userId = req.session.user;
    const id = req.query.id;
    await wishlistCollection.updateOne(
      { userId: userId },
      { $pull: { wishList: { productId: id } } }
    );
    res.redirect("/wishlist");
  } catch (error) {
    console.log(error);
  }
};

//checkOut
const checkout = async (req, res) => {
  try {
    //  let subtotal = req.query.subtotal;
    let cartItems = await cartCollection.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
      { $unwind: "$cartItem" },
      {
        $project: {
          productId: "$cartItem.productId",
          qty: "$cartItem.qty",
        },
      },
      {
        $lookup: {
          from: "poducts",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          name: "$productDetails.name",
          price: "$productDetails.price",
          qty: "$qty",
          id: "$productDetails._id",
          userId: "$userId",
        },
      },
      {
        $addFields: {
          total: { $multiply: ["$price", "$qty"] },
        },
      },
    ]);
    // console.log(cartItems)

    const subtotal = cartItems.reduce((acc, curr) => {
      acc = acc + curr.total;
      return acc;
    }, 0);
    const user = await userCollection.findOne({ _id: req.session.user });
    const brands = await productCollection.distinct("brand");
    const categories = await categoryCollection.find({ status: true });
    const address = await userCollection.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
      { $unwind: "$address" },
      {
        $project: {
          name: "$address.name",
          addressline1: "$address.addressline1",
          addressline2: "$address.addressline2",
          district: "$address.distict",
          state: "$address.state",
          country: "$address.country",
          pin: "$address.pin",
          mobile: "$address.mobile",
          id: "$address._id",
        },
      },
    ]);
    res.render("checkout.ejs", {
      user,
      brands,
      categories,
      address,
      cartItems,
      subtotal,
    });
  } catch (error) {
    console.log(error);
  }
};

const setAddressCheckout = async (req, res) => {
  try {
    const addresId = req.body.addresId;
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
        },
      },
      { $match: { _id: new mongoose.Types.ObjectId(addresId) } },
    ]);
    res.json({ data: address });
  } catch (error) {
    console.log(error);
  }
};

const postCheckOut = async (req, res) => {
  try {
    if (req.body.payment_mode === "COD") {
      const productData = await cartCollection.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: "$cartItem" },
        {
          $project: {
            _id: 0,
            productId: "$cartItem.productId",
            quantity: "$cartItem.qty",
          },
        },
        {
          $lookup: {
            from: "poducts",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: 0,
            productId: "$productId",
            quantity: "$quantity",
            price: "$productDetails.price",
          },
        },
      ]);

      const cartItems = await cartCollection.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: "$cartItem" },
        {
          $project: {
            productId: "$cartItem.productId",
            qty: "$cartItem.qty",
          },
        },
        {
          $lookup: {
            from: "poducts",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            price: "$productDetails.price",
            qty: "$qty",
          },
        },
        {
          $addFields: {
            total: { $multiply: ["$qty", "$price"] },
          },
        },
      ]);
      const subtotal = cartItems.reduce((acc, curr) => {
        acc = acc + curr.total;
        return acc;
      }, 0);

      if (req.body.couponid === "") {
        const orderDetails = new orderCollection({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin,
          },
          orderItems: productData,
          subTotal: subtotal,
          totalAmount: subtotal,
          paymentMethod: "COD",
        });
        await orderDetails.save();
        await cartCollection.findOneAndDelete({
          userId: mongoose.Types.ObjectId(req.session.user),
        });
        const productDetails = productData;
        for (let i = 0; i < productDetails.length; i++) {
          await productCollection.updateOne(
            { _id: productDetails[i].productId },
            { $inc: { stock: -productDetails[i].quantity } }
          );
        }
        res.redirect("/success");
      } else {
        await couponCollection.updateOne(
          { _id: req.body.couponid },
          { $push: { users: { userId: req.session.user } } }
        );
        const orderDetails = new orderCollection({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin,
          },
          orderItems: productData,
          couponUsed: req.body.couponid,
          subTotal: subtotal,
          totalAmount: req.body.total,
          paymentMethod: "COD",
        });
        await orderDetails.save();
        await cartCollection.findOneAndDelete({
          userId: mongoose.Types.ObjectId(req.session.user),
        });
        const productDetails = productData;
        for (let i = 0; i < productDetails.length; i++) {
          await productCollection.updateOne(
            { _id: productDetails[i].productId },
            { $inc: { stock: -productDetails[i].quantity } }
          );
        }
        res.redirect("/success");
      }
    }
    if (req.body.payment_mode === "pay") {
      const productData = await cartCollection.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: "$cartItem" },
        {
          $project: {
            _id: 0,
            productId: "$cartItem.productId",
            quantity: "$cartItem.qty",
          },
        },
        {
          $lookup: {
            from: "poducts",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: 0,
            productId: "$productId",
            quantity: "$quantity",
            price: "$productDetails.price",
          },
        },
      ]);

      const cartItems = await cartCollection.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: "$cartItem" },
        {
          $project: {
            productId: "$cartItem.productId",
            qty: "$cartItem.qty",
          },
        },
        {
          $lookup: {
            from: "poducts",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            price: "$productDetails.price",
            qty: "$qty",
          },
        },
        {
          $addFields: {
            total: { $multiply: ["$qty", "$price"] },
          },
        },
      ]);
      const subtotal = cartItems.reduce((acc, curr) => {
        acc = acc + curr.total;
        return acc;
      }, 0);

      if (req.body.couponid === "") {
        const orderDetails = new orderCollection({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin,
          },
          orderItems: productData,
          subTotal: subtotal,
          totalAmount: subtotal,
          paymentMethod: "online Payment",
        });
        await orderDetails.save();
        await cartCollection.findOneAndDelete({
          userId: mongoose.Types.ObjectId(req.session.user),
        });
        const productDetails = productData;
        for (let i = 0; i < productDetails.length; i++) {
          await productCollection.updateOne(
            { _id: productDetails[i].productId },
            { $inc: { stock: -productDetails[i].quantity } }
          );
        }
        const total = parseInt(subtotal);
        const create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: "http://localhost:3002/success",
            cancel_url: "http://localhost:3002/failed",
          },
          transactions: [
            {
              item_list: {
                items: [
                  {
                    name: "item",
                    sku: "item",
                    price: total,
                    currency: "USD",
                    quantity: 1,
                  },
                ],
              },
              amount: {
                currency: "USD",
                total,
              },
              description: "This is the payment description.",
            },
          ],
        };
        paypal.payment.create(
          create_payment_json,
          async function (error, payment) {
            if (error) {
              throw error;
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                  res.redirect(payment.links[i].href);
                }
              }
            }
          }
        );
      } else {
        await couponCollection.updateOne(
          { _id: req.body.couponid },
          { $push: { users: { userId: req.session.user } } }
        );
        const orderDetails = new orderCollection({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin,
          },
          orderItems: productData,
          couponUsed: req.body.couponid,
          subTotal: subtotal,
          totalAmount: req.body.total,
          paymentMethod: "online Payment",
        });
        await orderDetails.save();
        await cartCollection.findOneAndDelete({
          userId: mongoose.Types.ObjectId(req.session.user),
        });
        const productDetails = productData;
        for (let i = 0; i < productDetails.length; i++) {
          await productCollection.updateOne(
            { _id: productDetails[i].productId },
            { $inc: { stock: -productDetails[i].quantity } }
          );
        }
        const total = parseInt(subtotal);
        const create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: "http://localhost:3002/success",
            cancel_url: "http://localhost:3002/failed",
          },
          transactions: [
            {
              item_list: {
                items: [
                  {
                    name: "item",
                    sku: "item",
                    price: total,
                    currency: "USD",
                    quantity: 1,
                  },
                ],
              },
              amount: {
                currency: "USD",
                total,
              },
              description: "This is the payment description.",
            },
          ],
        };
        paypal.payment.create(
          create_payment_json,
          async function (error, payment) {
            if (error) {
              throw error;
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                  res.redirect(payment.links[i].href);
                }
              }
            }
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect("/404");
  }
};

paypal.configure({
  mode: "sandbox", // sandbox or live
  client_id:
    "AZlCOOPiXuoptUcu4w-DzOdbucMs9x7eMqyVBtGXGY3B3AC7ID66RggAGl6K9EdRZLLlhWsaT6i8TsQF",
  client_secret:
    "EHzygZ-5LLHB-34MTSY4s-I96Rf6MJafMUifpWXWWs5sx2x7B4YmZ07ScniIAq9AyLeGc__vB5iWBLa-",
});

const couponCheck = async (req, res) => {
  try {
    const code = req.body.input;
    console.log(code);
    let total = req.body.total;
    couponCollection.findOne({ code: code }).then((couponExist) => {
      if (couponExist) {
        let currentDate = new Date();
        if (
          currentDate >= couponExist.startingDate &&
          currentDate <= couponExist.expiryDate
        ) {
          let id = req.session.user;
          id = mongoose.Types.ObjectId(req.session.user);
          // const userExist = couponExist.users.findIndex((couponExist) => couponExist.users == id);
          couponCollection
            .findOne({ code: code }, { users: { $elemMatch: { userId: id } } })
            .then((exist) => {
              if (exist.users.length === 0) {
                console.log(total);
                console.log(couponExist.minAmount);
                if (total >= couponExist.minAmount) {
                  console.log(total);
                  res.json({ couponApplied: couponExist });
                } else {
                  let minAmount = couponExist.minAmount;
                  res.json({ minAmount });
                }
              } else {
                res.json({ userUsed: true });
              }
            });
        } else {
          res.json({ expired: true });
        }
      } else {
        res.json({ notExist: true });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
const success = (req, res) => {
  res.render("success");
};

const failed = (req, res) => {
  res.render("failed");
};

// eslint-disable-next-line no-undef
module.exports = {
  cartList,
  add_to_cart,
  productQtyAdd,
  productQtySub,
  deleteCart,
  wishList,
  view_wishList,
  deleteWishlist,
  checkout,
  setAddressCheckout,
  postCheckOut,
  couponCheck,
  success,
  failed,
};
