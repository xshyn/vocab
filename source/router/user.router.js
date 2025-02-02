const { Router } = require("express");
const passport = require("passport");
const { signup, logout, recaptchaChecking, login, sendCodeGet, sendCodePost, varifyCode, varifyCodeRecover, recoverPass } = require("../controller/user.controller");
const { userModel } = require("../model/user.model");
require("dotenv").config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const recaptcha = new Recaptcha(process.env.SITE_KEY_RECAPTCHA , process.env.SECRET_KEY_RECAPTCHA, {callback:"cb"})

const router = Router()

router.post("/signup", recaptcha.middleware.verify , recaptchaChecking , signup)
router.post("/login" , recaptcha.middleware.verify, recaptchaChecking ,passport.authenticate("local", {
    failureRedirect: '/login-page',
    failureFlash: true
}) , login)
router.get("/sendcodeget" , sendCodeGet)
router.post("/sendcodepost" , sendCodePost)
router.post("/varifycode" , varifyCode)
router.get("/logout" , logout)
router.post("/varifycoderecover" , varifyCodeRecover)
router.post("/recoverpass" , recoverPass)
module.exports = {
    userRouter: router
}