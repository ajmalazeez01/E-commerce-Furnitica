const adminLogin=(req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/adminlogin')
    }
}

const adminLogout=(req,res,next)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}

module.exports={
    adminLogin,
    adminLogout
}