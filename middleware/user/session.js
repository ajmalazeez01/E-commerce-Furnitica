const userLogin=(req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/login')
    }
}

const userLogout=(req,res,next)=>{
    if(req.session.user){
        res.redirect('/home')
    }else{
        next()
    }
}

module.exports={
    userLogin,
    userLogout
}