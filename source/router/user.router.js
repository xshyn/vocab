const { Router } = require("express");
const passport = require("passport");
const { signup, logout, recaptchaChecking } = require("../controller/user.controller");
require("dotenv").config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const recaptcha = new Recaptcha(process.env.SITE_KEY_RECAPTCHA , process.env.SECRET_KEY_RECAPTCHA, {callback:"cb"})

const router = Router()

router.post("/signup", recaptcha.middleware.verify , recaptchaChecking , signup)
router.post("/login" , recaptcha.middleware.verify, recaptchaChecking ,passport.authenticate("local", {
    successRedirect: '/home-page',
    failureRedirect: '/login-page',
    failureFlash: true
}))
router.get("/logout" , logout)

module.exports = {
    userRouter: router
}