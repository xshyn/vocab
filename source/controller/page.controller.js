function redirectMain(req , res){
    res.redirect("/login-page")
}
function loginPage(req, res) {
    res.render("login" , {siteKey: process.env.SITE_KEY_RECAPTCHA, secretKey:process.env.SECRET_KEY_RECAPTCHA})
}
function homePage(req , res) {
    res.render('home')
}
function profilePage(req , res) {
    res.render('profile')
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