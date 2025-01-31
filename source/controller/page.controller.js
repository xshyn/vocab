function redirectMain(req , res){
    if (req.user) return res.redirect("/home-page")
    res.redirect("/login-page")
}
function loginPage(req, res) {
    res.render("login" , {siteKey: process.env.SITE_KEY_RECAPTCHA, secretKey:process.env.SECRET_KEY_RECAPTCHA})
}
function homePage(req , res) {
    if(req.user) return res.render('home')
    res.redirect("/login-page")
}
function profilePage(req , res) {
    if(req.user) return res.render('profile')
    res.redirect("/login-page")
}
function signupPage(req , res) {
    res.render("register" , {siteKey: process.env.SITE_KEY_RECAPTCHA, secretKey:process.env.SECRET_KEY_RECAPTCHA})
}

module.exports = {
    redirectMain,
    loginPage,
    homePage,
    profilePage,
    signupPage
}