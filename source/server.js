const express = require("express")
const {allRouters} = require("./router/all.router")
const {errorHandler, notFoundError} = require("./utils/errorHandler")
const path = require('path')
const flash = require("express-flash")
const session = require("express-session")
const passport = require("passport")
const cookieParser = require("cookie-parser")

// Configs
require("dotenv").config()
require("./utils/passport.config")
require("./utils/mongo.config")

const app = express()
// Essential Middelwares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "/view/public")))
app.use(flash())

// Cookie
app.use(cookieParser())

// Session Setup
app.use(session({
    secret: "some secret",
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}))

// View Configs
app.set("views" , path.join(__dirname , "view"))
app.set("view engine" , "ejs")

// Passport Configs
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use(allRouters)


// Error Handling
app.use(notFoundError)
app.use(errorHandler)


// Port Listening
app.listen(process.env.SERVER_PORT , () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`);
})