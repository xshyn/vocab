const { userModel } = require("../model/user.model")
const { wordModel } = require("../model/word.model")
const nodemailer = require("nodemailer")

const { hashSync, compareSync } = require("bcrypt")
const { activityModel } = require("../model/activity.model")

const otpStore = {}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'vocab.varification@gmail.com',
      pass: 'ejxc cyek mhuz kvzx'
    }
});

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

        const result = await userModel.create({
            email,
            password: hashSync(password, 10),
            lastLogin: Date.now(),
            rule: 'User'
        })
        res.redirect("/login-page")
    } catch (error) {
        next(error)
        
    }
}
async function adminAdd(req , res, next) {
    try {
        const { entry , email , password } = req.body
        if(entry !== "adminAdder") throw {statusCode: 403, message: "Not Allowed"}
        const user = await userModel.findOne({email})
        if(user) throw {statusCode: 400, message: "user already exists"}

        const result = await userModel.create({
            email,
            password: hashSync(password, 10),
            lastLogin: new Date(),
            rule: 'Admin'
        })
        res.json({statusCode: 200, message: "Successful"})
    } catch (error) {
        next(error)
        
    }
}

async function logout(req , res , next){
    req.logout((err) => {
        if(err) return next(err)
        res.redirect("/login-page")
    })
}

async function login(req , res , next){
    const user = req.user
    if(user.rule === "Admin") return res.redirect("/admin-page")
    if(!req.session.words){
        req.session.words = await wordModel.find({user: user.id})
    }
    await activityModel.create({
        userid: user._id
    })
    const act = await activityModel.findOne({userid: user._id}).sort({createdAt: "desc"})
    await userModel.updateOne({_id: user._id} , {
        $set: {
            lastLogin: act.createdAt
        }
    })

    res.redirect("/home-page")

}
async function sendCodeGet(req , res , next){
    try {
        const user = req.user
        const otp = generateOTP()
        const expires = Date.now() + 5 * 60 * 1000
        otpStore[user._id] = {otp, expires}

        const mailOptions = {
            from: 'Vocab',
            to: user.email,
            subject: 'Vocab Varification Code',
            text: `Your code is ${otp}. It will expire in 5 minutes.`
        };
        await transporter.sendMail(mailOptions);
        return res.render("submit-code" , {email: null});
    } catch (error) {
        next(error)
    }

}
async function sendCodePost(req , res , next){
    try {
        const {email} = req.body
        const user = await userModel.findOne({email: email})
        const otp = generateOTP()
        const expires = Date.now() + 5 * 60 * 1000
        otpStore[user._id] = {otp, expires}

        const mailOptions = {
            from: 'Vocab',
            to: user.email,
            subject: 'Vocab Varification Code',
            text: `Your code is ${otp}. It will expire in 5 minutes.`
        };
        await transporter.sendMail(mailOptions);
        return res.render("submit-code" , {email});
    } catch (error) {
        next(error)
    }

}

async function varifyCode(req ,res , next){

    try {
        const user = req.user
        const { otpcode } = req.body
    
        const record = otpStore[user._id];
    
        if (Date.now() > record.expires) {
            delete otpStore[user._id];
            req.logout((err) => {
                if(err) return next(err)
            })
            throw { statusCode:400 , message: 'OTP has expired. Please request a new one.' };
        }
        if (record.otp != otpcode) {
            req.logout((err) => {
                if(err) return next(err)
            })
            throw { statusCode:400 ,message: 'Invalid OTP. Please try again.' };
        }
    
        delete otpStore[user._id];

        return res.redirect("/home-page");
        
    } catch (err) {
        next(err)
    }
}

async function varifyCodeRecover(req , res , next){
    try {
        const {email} = req.body
        const user = await userModel.findOne({email: email})
        const { otpcode } = req.body
    
        const record = otpStore[user._id];
    
        if (Date.now() > record.expires) {
            delete otpStore[user._id];
            req.logout((err) => {
                if(err) return next(err)
            })
            throw { statusCode:400 , message: 'OTP has expired. Please request a new one.' };
        }
        if (record.otp != otpcode) {
            req.logout((err) => {
                if(err) return next(err)
            })
            throw { statusCode:400 ,message: 'Invalid OTP. Please try again.' };
        }
    
        delete otpStore[user._id];
        

        return res.render("new-pass" , {userid: user._id});
        
    } catch (err) {
        next(err)
    }
}

async function recoverPass(req ,res , next){
    try {
        const {userid , newpass , conpass} = req.body
        if(newpass !== conpass) throw {statusCode: 400 , message: "new pass and confirm pass are not identical"}
        const user = await userModel.updateOne({_id: userid} , {
            $set: {
                password: hashSync(newpass , 10)
            }
        })
        res.redirect("/user/logout")
    } catch (err) {
        next(err)
    }
}
async function editPass(req ,res , next){
    try {
        const {userid ,curpass, newpass , conpass} = req.body
        const user = await userModel.findOne({_id: userid})
        if(!compareSync(curpass, user.password)) throw {statusCode:400 , message: "current pass is incorrect"}
        if(newpass !== conpass) throw {statusCode: 400 , message: "new pass and confirm pass are not identical"}
        await userModel.updateOne({_id: userid} , {
            $set: {
                password: hashSync(newpass, 10)
            }
        })
        res.redirect("/user/logout")
    } catch (err) {
        next(err)
    }
}



module.exports = {
    signup,
    recaptchaChecking,
    logout,
    login,
    sendCodeGet,
    sendCodePost,
    varifyCode,
    varifyCodeRecover,
    recoverPass,
    editPass,
    adminAdd,
}