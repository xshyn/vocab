const { userModel } = require("../model/user.model")

async function signUp(req , res, next) {
    try {
        const { email , password } = req.body
        const user = await userModel.findOne({email})
        if(user){
            throw {statusCode: 400, message: "user already exists"}
        }
        const result = await userModel.create({email, password})
        res.send({
            statusCode: 200,
            message: "successful",
            user: result
        })
    } catch (error) {
        next(error)
        
    }
}

async function signIn(req , res , next){
    try {
        const {email , password} = req.body
        const user = await userModel.findOne({email, password})
        if(!user){
            throw {statusCode: 404, message: "email or password is incorrect"}
        }
        res.send({
            statusCode: 200,
            message: "successful",
            user: user
        })
    } catch (error) {
        next(error)
        
    }
}

async function editProfile(req , res , next){
}

module.exports = {
    signUp,
    signIn
}