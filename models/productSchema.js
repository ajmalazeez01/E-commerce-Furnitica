const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:String,
    category:String,
    brand:String,
    description:String,
    stock:Number,
    price:Number,
    image:String,
    status:{type:Boolean,default:true}   
})

 const productCollection=mongoose.model("poduct",productSchema)
module.exports=productCollection
