const { Router } = require("express");
const {wordRouter} = require("./wordRouter");

const router = Router()

router.use('/word' , wordRouter)

router.get("/" , (req, res) => {
    res.send("all routers")
})

module.exports = {
    allRouters: router
}