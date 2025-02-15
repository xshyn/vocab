const { Router } = require("express");
const passport = require("passport");
const { signup, logout, recaptchaChecking, login, sendCodePost, varifyCodeRecover, recoverPass, editPass, adminAdd , uploadProfile } = require("../controller/user.controller");
const { userModel } = require("../model/user.model");
const { upload } = require("../utils/multer.config");
const { userLoged, ifAdminRedirect, userNotLoged, ifLoginIsReferrer, ifRecoverPassIsReferrer, ifSubmitCodePageIsReferrer, ifNewPassIsReferrer } = require("../middlewares");
require("dotenv").config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const recaptcha = new Recaptcha(process.env.SITE_KEY_RECAPTCHA , process.env.SECRET_KEY_RECAPTCHA, {callback:"cb"})


const router = Router()

router.post("/signup", recaptcha.middleware.verify , recaptchaChecking , signup)
router.post("/login" ,passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: '/login-page'
}) , login)
router.post("/sendcodepost" , userNotLoged, ifRecoverPassIsReferrer ,sendCodePost)
router.get("/logout" , userLoged ,logout)
router.post("/varifycoderecover", userNotLoged, ifSubmitCodePageIsReferrer , varifyCodeRecover)
router.post("/recoverpass" , userNotLoged, ifNewPassIsReferrer , recoverPass)
router.post("/editpass" , userLoged, editPass)
router.post("/admin/add", adminAdd)
router.post("/upload-profile", userLoged, ifAdminRedirect ,upload.single('profile') ,uploadProfile)
module.exports = {
    userRouter: router
}