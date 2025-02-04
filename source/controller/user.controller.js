const { userModel } = require("../model/user.model")
const { wordModel } = require("../model/word.model")
const nodemailer = require("nodemailer")
const { hashSync, compareSync } = require("bcrypt")
const { activityModel } = require("../model/activity.model")
const path = require("path")


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
        const referrer = req?.header("Referrer") ?? req.headers.referrer
        req.flash("error" , "Recaptcha Required")
        return res.redirect(referrer ?? "/login-page")
    } catch (err) {
        next(err)
        
    }
}

async function signup(req , res, next) {
    try {
        const { email , password , confirmPassword } = req.body
        const user = await userModel.findOne({email})
        const referrer = req?.header("Referrer") ?? req.headers.referrer
        if(user) {
            req.flash("error" , "User Already Exists")
            return res.redirect(referrer ?? "/signup-page")
        }
        if(password !== confirmPassword){
            req.flash("error" , "Password and Confirm Password are not Identical")
            return res.redirect(referrer ?? "/signup-page")
        }

        const result = await userModel.create({
            email,
            password: hashSync(password, 10),
            lastLogin: Date.now(),
            rule: 'User'
        })
        return res.redirect("/login-page")
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
            return res.redirect("/login-page")
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

    return res.redirect("/home-page")

}

async function sendCodePost(req , res , next){
    try {
        const {email} = req.body
        const referrer = req?.header("Referrer") ?? req.headers.referrer
        const user = await userModel.findOne({email})
        if(!email) {
            req.flash("error" , "email is required")
            return res.redirect(referrer ?? "/recoverpass-page")
        }
        if(!user){
            req.flash("error" , "user does not exist")
            return res.redirect(referrer ?? "/recoverpass-page")
        }

        const otp = generateOTP()
        const expires = Date.now() + 5 * 60 * 1000
        otpStore[email] = {otp, expires}

        const mailOptions = {
            from: 'Vocab',
            to: user.email,
            subject: 'Vocab Varification Code',
            text: `Your code is ${otp}. It will expire in 5 minutes.`
        };
        await transporter.sendMail(mailOptions);
        res.cookie("email" , user.email , {
            maxAge: 1000 * 60 * 5
        })
        return res.redirect("/submitcode-page");
    } catch (error) {
        next(error)
    }

}
async function varifyCodeRecover(req , res , next){
    try {
        const { email } = req.cookies
        const user = await userModel.findOne({email})
        const { otpcode } = req.body
    
        const record = otpStore[user.email];

        const referrer = req?.header("Referrer") ?? req.headers.referrer
    
        if (Date.now() > record.expires) {
            delete otpStore[user._id];
            res.clearCookie("email")
            req.flash("error" , 'OTP has expired. Please request a new one.')
            return res.redirect(referrer ?? "/recoverpass-page")
        }
        if (record.otp != otpcode) {
            req.flash("error" , 'Invalid OTP. Please try again.')
            return res.redirect(referrer ?? "/submitcode-page")
        }
    
        delete otpStore[user._id];
        
        return res.redirect("/newpass-page");
        
    } catch (err) {
        next(err)
    }
}

async function recoverPass(req ,res , next){
    try {
        const {newpass , conpass} = req.body
        const {email} = req.cookies
        if(newpass !== conpass){
            req.flash("error" , "new pass and confirm pass are not identical")
            return res.redirect('/newpass-page')
        }
        const user = await userModel.updateOne({email: email} , {
            $set: {
                password: hashSync(newpass , 10)
            }
        })
        res.clearCookie("email")
        return res.redirect("/user/logout")
    } catch (err) {
        next(err)
    }
}
async function editPass(req ,res , next){
    try {
        const {userid ,curpass, newpass , conpass} = req.body
        const user = await userModel.findOne({_id: userid})

        const referrer = req?.header("Referrer") ?? req.headers.referrer
        if(!compareSync(curpass, user.password)){
            req.flash("error" , "current pass is incorrect")
            return res.redirect(referrer ?? '/newpass-page')            
        }
        if(!newpass){
            req.flash("error" , "new pass is required")
            return res.redirect(referrer ?? '/newpass-page')  
        } 
        if(!conpass){
            req.flash("error" , "confirm pass is required")
            return res.redirect(referrer ?? '/newpass-page')  
        } 
        if(newpass !== conpass) {
            req.flash("error" , "new pass and confirm pass are not identical")
            return res.redirect(referrer ?? '/newpass-page')
        } 
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

async function uploadProfile(req , res , next){
    try {
        const userid = req.user._id
        const imageUrl = `/uploads/${req.file.filename}`
        await userModel.findByIdAndUpdate(userid, { profile: imageUrl })
        return res.json({ success: true, imageUrl });

    } catch (err) {
        next(err)
        
    }
}



module.exports = {
    signup,
    recaptchaChecking,
    logout,
    login,
    sendCodePost,
    varifyCodeRecover,
    recoverPass,
    editPass,
    adminAdd,
    uploadProfile
}