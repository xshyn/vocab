const { Router } = require("express");
const passport = require("passport");
const { signup, logout, recaptchaChecking, login, sendCodePost, varifyCodeRecover, recoverPass, editPass, adminAdd , uploadProfile } = require("../controller/user.controller");
const { userModel } = require("../model/user.model");
const { upload } = require("../utils/multer.config");
require("dotenv").config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const recaptcha = new Recaptcha(process.env.SITE_KEY_RECAPTCHA , process.env.SECRET_KEY_RECAPTCHA, {callback:"cb"})


const router = Router()

router.post("/signup", recaptcha.middleware.verify , recaptchaChecking , signup)
router.post("/login" , recaptcha.middleware.verify, recaptchaChecking ,passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: '/login-page'
}) , login)
router.post("/sendcodepost" , sendCodePost)
router.get("/logout" , logout)
router.post("/varifycoderecover" , varifyCodeRecover)
router.post("/recoverpass" , recoverPass)
router.post("/editpass" , editPass)
router.post("/admin/add", adminAdd)
router.post("/upload-profile", upload.single('profile') ,uploadProfile)
module.exports = {
    userRouter: router
}