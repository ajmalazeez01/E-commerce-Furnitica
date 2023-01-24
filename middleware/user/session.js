const userLogin=(req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/login')
    }
}

const userLogout = (req,res)=>{
    try {
        req.session.destroy();
        console.log('sign out');
        res.redirect('/')
        res.end()
        
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    userLogin,
    userLogout
}