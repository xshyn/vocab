const express = require("express")
const {allRouters} = require("./router/allRouters")
const {errorHandler, notFoundError} = require("./utils/errorHandler")
const { configDotenv } = require("dotenv")

require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(allRouters)

app.use(notFoundError)
app.use(errorHandler)

app.listen(process.env.SERVER_PORT , () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`);
})