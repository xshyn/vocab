const { userModel } = require("../model/user.model")

function recaptchaChecking(req , res, next){
    try {
        if(!req.recaptcha.error){
            return next()
        }
        throw {statusCode: 401 , message: "Recaptcha Required"}
    } catch (err) {
        next(err)
        
    }
}

async function signup(req , res, next) {
    try {
        const { email , password , confirmPassword } = req.body
        const user = await userModel.findOne({email})
        if(user) throw {statusCode: 400, message: "user already exists"}
        if(password !== confirmPassword) throw {statusCode: 400, message: "Password and Confirm Password are not Equal"}

        const result = await userModel.create({email, password})
        res.redirect("/login-page")
    } catch (error) {
        next(error)
        
    }
}

async function logout(req , res , next){
    req.logout((err) => {
        if(err) return next(err)
        res.sendStatus(200).redirect("/login-page")
    })
}



// async function editProfile(req , res , next){
// }

module.exports = {
    signup,
    recaptchaChecking,
    logout
}