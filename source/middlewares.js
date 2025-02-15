function userLoged(req , res , next){
    if(!req.user){
        req.flash("error" , "please Login")
        return res.redirect("/login-page")
    }
    next()
}
function userNotLoged(req , res , next){
    if(req.user) return res.redirect("/home-page")
    next()
}
function ifAdminRedirect(req , res , next) {
    if(req.user.rule === "Admin") return res.redirect("/admin-page")
    next()
}
function ifUserRedirect(req , res , next) {
    if(req.user.rule === "User") return res.redirect("/home-page")
    next()
}
function ifLoginIsReferrer(req , res , next){
    const referrer = req?.header("Referrer") ?? req.headers.referrer
    if(!referrer){
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    if(referrer !== "http://localhost:3000/login-page") {
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    next()
}
function ifRecoverPassIsReferrer(req , res , next){
    const referrer = req?.header("Referrer") ?? req.headers.referrer
    if(!referrer){
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    if(referrer !== "http://localhost:3000/recoverpass-page") {
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    next()
}
function ifSendCodePostIsReferrer(req , res , next){
    const referrer = req?.header("Referrer") ?? req.headers.referrer
    if(!referrer){
        req.flash("error" , "not authorized. referrer doesn't exist")
        return res.redirect("/login-page")
    }
    if(referrer !== "http://localhost:3000/recoverpass-page") {
        req.flash("error" , "not authorized from here")
        return res.redirect("/login-page")
    }
    next()
}
function ifSubmitCodePageIsReferrer(req , res , next){
    const referrer = req?.header("Referrer") ?? req.headers.referrer
    if(!referrer){
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    if(referrer !== "http://localhost:3000/submitcode-page") {
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    next()
}
function ifVarifyCodeRecoverIsReferrer(req , res , next){
    const referrer = req?.header("Referrer") ?? req.headers.referrer
""
    if(!referrer){
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    if(referrer !== "http://localhost:3000/submitcode-page") {
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    next()
}
function ifNewPassIsReferrer(req , res , next){
    const referrer = req?.header("Referrer") ?? req.headers.referrer
    if(!referrer){
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    if(referrer !== "http://localhost:3000/newpass-page") {
        req.flash("error" , "not authorized")
        return res.redirect("/login-page")
    }
    next()
}

module.exports = {
    userLoged,
    userNotLoged,
    ifAdminRedirect,
    ifUserRedirect,
    ifLoginIsReferrer,
    ifRecoverPassIsReferrer,
    ifSendCodePostIsReferrer,
    ifSubmitCodePageIsReferrer,
    ifVarifyCodeRecoverIsReferrer,
    ifNewPassIsReferrer
}