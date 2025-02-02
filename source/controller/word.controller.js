const { userModel } = require("../model/user.model");
const { wordModel } = require("../model/word.model")

async function addWord (req , res , next) {
    try {
        const user = req.user;
        const {persian, english, pro, exp} = req.body
        const result = await wordModel.create({
            persian,
            english,
            pro,
            exp,
            user: user.id
        })
        await userModel.updateOne({_id: user._id} , {
            $set: {
                wordsCount: user.wordsCount + 1
            }
        })
        if(!req.session.words){
            req.session.words = [result]
        }
        else{
            req.session.words.push(result)
        }
        res.redirect("/home-page")     
    } catch (error) {
        next(error)
    }

}
async function deleteWord (req , res , next) {
    try {
        if(!req.user) throw {statusCode: 400, message: "you are not logged in"}
        const { wordid } = req.body
        const user = req.user
        const  result = await wordModel.deleteOne({_id: wordid})
        req.session.words = await wordModel.find({user: user.id})
        await userModel.updateOne({_id: user._id} , {
            $set: {
                wordsCount: user.wordsCount - 1
            }
        })
        res.redirect('/home-page')
        
    } catch (err) {
        next(err)
    }
}
async function updateWord (req , res , next) {
    try {
        if(!req.user) throw {statusCode: 400, message: "you are not logged in"}
        const user = req.user
        const { wordid , english, persian , pro, exp } = req.body
        const  result = await wordModel.updateOne({_id: wordid} , {
            $set: {
                persian:persian,
                english:english,
                pro:pro,
                exp:exp
            }
        })
        req.session.words = await wordModel.find({user: user.id})
        res.redirect('/home-page')
        
    } catch (err) {
        next(err)
    }
}
async function searchWord(req , res , next) {
    try {
        if(!req.user) throw {statusCode: 400, message: "you are not logged in"}
        const user = req.user
        const { english } = req.body
        const  words = await wordModel.find({user: user._id, english: english})
        let wordIsEmpty = true
        if(words.length > 0){
            wordIsEmpty = false
        }
        res.render("home" , {wordIsEmpty, words})
    }catch(err){
        next(err)
    }
}

module.exports = {
    addWord,
    deleteWord,
    updateWord,
    searchWord
}
