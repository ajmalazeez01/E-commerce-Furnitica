const adminLogin=(req,res,next)=>{
    if( req.session.admin){
        next()
    }else{
        res.redirect('/adminlogin')
    }
}

const adminLogout = (req,res)=>{
    try {
        req.session.destroy();
        console.log('sign out');
        res.redirect('/adminlogin')
        res.end()
        
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    adminLogin,
    adminLogout
}