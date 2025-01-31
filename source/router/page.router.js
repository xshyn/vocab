const { Router } = require("express")
const { loginPage, homePage, profilePage, signupPage, redirectMain } = require("../controller/page.controller")
require("dotenv").config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const recaptcha = new Recaptcha(process.env.SITE_KEY_RECAPTCHA , process.env.SECRET_KEY_RECAPTCHA , {callback:"cb"})

const router = Router()

router.get("/" , redirectMain)
router.get("/login-page" ,loginPage)
router.get("/home-page" , homePage)
router.get("/profile-page" , profilePage)
router.get("/signup-page" , signupPage)

module.exports = {
    pageRouter: router
}