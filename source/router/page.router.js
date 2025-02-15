const { Router } = require("express")
const { loginPage, homePage, profilePage, signupPage, redirectMain, addWordPage, updateWordPage, submitCodePage, recoverPassPage, newPassPage, editPassPage, adminPage} = require("../controller/page.controller")
const passport = require("passport")
const { ifAdminRedirect, userLoged, ifUserRedirect, userNotLoged, ifLoginIsReferrer, ifSendCodePostIsReferrer, ifVarifyCodeRecoverIsReferrer } = require("../middlewares")
require("dotenv").config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const recaptcha = new Recaptcha(process.env.SITE_KEY_RECAPTCHA , process.env.SECRET_KEY_RECAPTCHA , {callback:"cb"})

const router = Router()

router.get("/" , userNotLoged, redirectMain)
router.get("/login-page" , userNotLoged, loginPage)
router.get("/home-page" , userLoged , ifAdminRedirect ,homePage)
router.get("/profile-page" , userLoged , ifAdminRedirect , profilePage)
router.get("/signup-page" , userNotLoged ,signupPage)
router.get("/addword-page" , userLoged , ifAdminRedirect, addWordPage)
router.post("/updateword-page", userLoged , ifAdminRedirect , updateWordPage)
router.get("/submitcode-page" , userNotLoged, ifSendCodePostIsReferrer , submitCodePage)
router.get("/recoverpass-page" , userNotLoged , ifLoginIsReferrer ,recoverPassPage)
router.get("/newpass-page" , userNotLoged, ifVarifyCodeRecoverIsReferrer , newPassPage)
router.get("/editpass-page" , userLoged , ifAdminRedirect , editPassPage)

router.get("/admin-page" , userLoged , ifUserRedirect , adminPage)


module.exports = {
    pageRouter: router
}