const passport = require("passport");
const { Strategy } = require("passport-local")
const { userModel } = require("../model/user.model")

passport.serializeUser((user , done) => {
    done(null , user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        done(null , user)
    } catch (err) {
        done(err , null)
        
    }
})

passport.use(new Strategy({usernameField:"email"} , async (email , password , done) => {
    try {
        const user = await userModel.findOne({email})
        if(!user) throw new Error("user not found")
        if(password !== user.password) throw new Error("invalid credentials")
        done(null , user)
    } catch (err) {
        done(err , null)
        
    }
}))