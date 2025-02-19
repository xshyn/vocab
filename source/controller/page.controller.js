const { activityModel } = require("../model/activity.model");
const { userModel } = require("../model/user.model")
const { wordModel } = require("../model/word.model")

function timeGetter(date){
    const now = new Date(date);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getLast7Days() {
    let days = [];
    for (let i = 6; i >= 0; i--) {
        let now = new Date();
        now.setDate(now.getDate() - i);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        days.push(`${year}-${month}-${day}`);
    }
    return days;
}

function redirectMain(req , res){
    res.redirect("/login-page")
}
function loginPage(req, res) {
    res.render("login")
}
function homePage(req , res) {
    let wordIsEmpty = true
    let words = []
    if(req.session.words && req.session.words.length > 0){
        wordIsEmpty = false
        words = req.session.words
    }
    res.render("home" , {wordIsEmpty , words})
}
async function profilePage(req , res) {
    const user = req.user
    if(user) {
        const words = await wordModel.find({user: user._id})
        return res.render('profile' , {user: req.user, words})
    }
    res.redirect("/login-page")
}
function signupPage(req , res) {
    res.render("register" , {siteKey: process.env.SITE_KEY_RECAPTCHA, secretKey:process.env.SECRET_KEY_RECAPTCHA})
}
function addWordPage(req , res){
    res.render('addWord')
}
async function updateWordPage(req , res){
    const { wordid } = req.body
    const word = await wordModel.findOne({_id: wordid})
    res.render('updateWord' , {word})
}
function submitCodePage(req , res){
    res.render("submit-code")
}
function recoverPassPage(req , res){
    res.render("send-code")
}
function newPassPage(req , res){
    res.render("new-pass")
}
function editPassPage(req , res){
    const user = req.user
    res.render("edit-pass" , {userid: user._id})
}
async function adminPage(req , res, next){
    try {
        if (!req.user || req.user.rule !== "Admin") return res.redirect("/login-page")

        const last7Days = getLast7Days();

        const activityCounts = await activityModel.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: new Date(new Date().setDate(new Date().getDate() - 6)) 
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        let activityData = last7Days.reduce((acc, date) => {
            acc[date] = 0;
            return acc;
        }, {});

        activityCounts.forEach(activity => {
            const dateKey = `${activity._id.year}-${String(activity._id.month).padStart(2, '0')}-${String(activity._id.day).padStart(2, '0')}`;
            if (activityData[dateKey] !== undefined) {
                activityData[dateKey] = activity.count;
            }
        });

        const today = new Date();
        
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 6);


        const admin = req.user
        const totalUsers = await userModel.find({rule: "User"})
        const totalWords = await wordModel.find()
        const totalActs = await activityModel.find()
        const totalWeeklyActs = await activityModel.find({
            createdAt: { $gte: lastWeekStart, $lt: today }
        });
        res.render("crm" , {admin , totalUsers, totalWords, timeGetter , totalActs, totalWeeklyActs,
            labels: last7Days, data: Object.values(activityData)})

    } catch (err) {
        next(err)
    }
}

module.exports = {
    redirectMain,
    loginPage,
    homePage,
    profilePage,
    signupPage,
    addWordPage,
    updateWordPage,
    submitCodePage,
    recoverPassPage,
    newPassPage,
    editPassPage,
    adminPage
}