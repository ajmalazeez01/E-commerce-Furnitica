const express = require('express')
const router = express.Router()
const adminControllers = require('../controllers/adminController')
const multer = require('../middleware/multer')
const session = require("../middleware/admin/session");

//admin login
router.get('/adminlogin', adminControllers.loadLogin)
router.post('/adminlogin', adminControllers.userLogin)

//dash bord
router.get('/adminDashboard', adminControllers.amdinDasboard)

//user management
router.get('/user', adminControllers.user)
router.get('/userblock', adminControllers.userBlock)

//product management
router.get('/product', adminControllers.product)
router.get('/productblock', adminControllers.productBlock)
router.post('/insertproduct', multer.single('image'), adminControllers.insertProduct)
router.post('/posteditproduct/:name', multer.single('image'), adminControllers.postEditProduct)
router.get('/editproduct', adminControllers.editProduct)
router.get('/deleteproduct', adminControllers.deleteproduct)

//category management
router.get('/category', adminControllers.category)
router.get('/categoryblock', adminControllers.categoryBlock)
router.get('/editcategory', adminControllers.editCategory)
router.post('/posteditcategory/:name', adminControllers.postEditCategory)
router.get('/deletecategory', adminControllers.deleteCategory)
router.post('/insertcategory', multer.single('image'), adminControllers.insertCategory)

//coupon manage
router.get('/coupon', adminControllers.couponManage)
router.post('/coupon',adminControllers.insertCoupon)
router.get('/couponblock', adminControllers.couponBlock)


//order manage
router.get('/ordermanage', adminControllers.orderManage)
router.post('/ordermanage', adminControllers.orderUpdate)
router.get('/vieworder', adminControllers.viewOrder)

// sales report
router.get('/sales',adminControllers.salesPage)
router.post('/salesdata',adminControllers.post_pdf_Data)
router.get('/csv_download',adminControllers.csvDownload)




module.exports = router
