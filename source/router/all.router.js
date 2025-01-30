const { Router } = require("express");
const { home, profile, login, signup } = require("../controller/all.controller");
const passport = require("passport");
const { userModel } = require("../model/user.model");

const router = Router()

router.get("/login" , login)
router.get("/home" , home)
router.get("/profile" , profile)
router.get("/signup" , signup)
router.get("/" , (req , res) => {
    req.session.user = {id: 1 , username:"xshynx" , password:"1234"}

    res.send({id: req.session.user.id})
})
router.post("/auth" , passport.authenticate("local") , (req , res) => {
    const user = req.user
    if(user) return res.send(user)
    return res.sendStatus(401).send("not authorized")
})
router.post("/user" , async (req , res) => {
    const {email , password} = req.body
    const user = await userModel.create({email , password})
    res.send(user)
})
router.get("/safe" ,(req , res) => {
    if(req.user) return res.send("safe route")
    return res.send("only users can see")

})
router.get("/logout" , (req , res) => {
    req.logOut((err) => {
        if(!err) return res.send("logout successfully")
    })
})
module.exports = {
    allRouters: router
}