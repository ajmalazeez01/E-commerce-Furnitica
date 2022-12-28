const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    cpassword:String,
    number:Number,
    status:{type:Boolean,default:true}   
})

 const userCollection=mongoose.model("user",userSchema)
module.exports=userCollection

