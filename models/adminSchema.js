const mongoose=require('mongoose')

const adminSchema=new mongoose.Schema({
    
    email:String,
    password:String,
    
})

 const adminCollection=mongoose.model("admin",adminSchema)
module.exports=adminCollection