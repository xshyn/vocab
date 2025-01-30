const { Router } = require("express");
const { home, profile, login, signup } = require("../controller/all.controller");

const router = Router()

router.get("/" , login)
router.get("/home" , home)
router.get("/profile" , profile)
router.get("/signup" , signup)

module.exports = {
    allRouters: router
}