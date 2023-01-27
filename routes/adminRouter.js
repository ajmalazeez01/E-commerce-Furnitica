const express = require('express')
const router = express()
const adminControllers = require('../controllers/adminController')
const multer = require('../middleware/multer')
const session = require("../middleware/admin/session");

//admin login
router.get('/adminlogin', adminControllers.loadLogin)
router.post('/adminlogin', adminControllers.adminLogin)
router.get('/logout',session.adminLogout)


//dash bord
router.get('/adminDashboard',session.adminLogin, adminControllers.adminDashboard)

//user management
router.get('/user',session.adminLogin, adminControllers.user)
router.get('/userblock',session.adminLogin, adminControllers.userBlock)

//product management
router.get('/product',session.adminLogin, adminControllers.product)
// router.get('/productblock',session.adminLogin,adminControllers.productBlock)
router.post('/insertproduct',session.adminLogin, multer.single('image'), adminControllers.insertProduct)
router.post('/posteditproduct',session.adminLogin, multer.single('image'), adminControllers.postEditProduct)
router.get('/editproduct',session.adminLogin, adminControllers.editProduct)
router.get('/deleteproduct',session.adminLogin, adminControllers.deleteproduct)

//category management
router.get('/category',session.adminLogin, adminControllers.category)
router.get('/categoryblock',session.adminLogin, adminControllers.categoryBlock)
router.get('/editcategory',session.adminLogin, adminControllers.editCategory)
router.post('/posteditcategory',session.adminLogin,multer.single('image'), adminControllers.postEditCategory)
router.get('/deletecategory',session.adminLogin, adminControllers.deleteCategory)
router.post('/insertcategory',session.adminLogin, multer.single('image'), adminControllers.insertCategory)

//coupon manage
router.get('/coupon',session.adminLogin, adminControllers.couponManage)
router.post('/coupon',session.adminLogin,adminControllers.insertCoupon)
router.get('/couponblock',session.adminLogin, adminControllers.couponBlock)


//order manage
router.get('/ordermanage',session.adminLogin, adminControllers.orderManage)
router.post('/ordermanage',session.adminLogin, adminControllers.orderUpdate)
router.get('/vieworder',session.adminLogin, adminControllers.viewOrder)

// sales report
router.get('/sales',session.adminLogin, adminControllers.salesPage)
router.post('/salesdata',session.adminLogin, adminControllers.post_pdf_Data)
router.get('/csv_download',session.adminLogin, adminControllers.csvDownload)

//banner manage
router.get('/banner',session.adminLogin,adminControllers.bannerManage)
router.post('/banner',session.adminLogin, multer.single('image'), adminControllers.addBanner)
router.get('/bannerblock',session.adminLogin,adminControllers.bannerBlock)







module.exports = router
