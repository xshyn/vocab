const { wordModel } = require("../model/word.model")

function redirectMain(req , res){
    if (req.user) return res.redirect("/home-page")
    res.redirect("/login-page")
}
function loginPage(req, res) {
    res.render("login" , {siteKey: process.env.SITE_KEY_RECAPTCHA, secretKey:process.env.SECRET_KEY_RECAPTCHA})
}
function homePage(req , res) {
    if(!req.user) return res.redirect("/login-page")
    let wordIsEmpty = true
    let words = []
    if(req.session.words && req.session.words.length > 0){
        wordIsEmpty = false
        words = req.session.words
    }
    res.render("home" , {wordIsEmpty , words})
}
function profilePage(req , res) {
    if(req.user) return res.render('profile')
    res.redirect("/login-page")
}
function signupPage(req , res) {
    res.render("register" , {siteKey: process.env.SITE_KEY_RECAPTCHA, secretKey:process.env.SECRET_KEY_RECAPTCHA})
}
function listPage(req , res){
    if(!req.user) return res.redirect("/login-page")
    let wordIsEmpty = true
    let words = []
    if(req.session.words && req.session.words.length > 0){
        wordIsEmpty = false
        words = req.session.words
    }
    res.render("list" , {wordIsEmpty , words})
}
function addWordPage(req , res){
    res.render('addWord')
}
async function updateWordPage(req , res){
    const { wordid } = req.body
    const word = await wordModel.findOne({_id: wordid})
    res.render('updateWord' , {word})
}

module.exports = {
    redirectMain,
    loginPage,
    homePage,
    profilePage,
    signupPage,
    listPage,
    addWordPage,
    updateWordPage
}