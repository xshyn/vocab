const { Router } = require("express")
const { loginPage, homePage, profilePage, signupPage, redirectMain, listPage, addWordPage, updateWordPage } = require("../controller/page.controller")
require("dotenv").config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const recaptcha = new Recaptcha(process.env.SITE_KEY_RECAPTCHA , process.env.SECRET_KEY_RECAPTCHA , {callback:"cb"})

const router = Router()

router.get("/" , redirectMain)
router.get("/login-page" ,loginPage)
router.get("/home-page" , homePage)
router.get("/profile-page" , profilePage)
router.get("/signup-page" , signupPage)
router.get("/list-page" , listPage)
router.get("/addword-page" , addWordPage)
router.post("/updateword-page" , updateWordPage)


module.exports = {
    pageRouter: router
}