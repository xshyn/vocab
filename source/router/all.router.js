const { Router } = require("express");
const passport = require("passport");
const { userModel } = require("../model/user.model");
const { pageRouter } = require("./page.router");
const { userRouter } = require("./user.router");
const { wordRouter } = require("./word.router");

const router = Router()

router.use(pageRouter)
router.use("/user" , userRouter)
router.use("/word" , wordRouter)


module.exports = {
    allRouters: router
}