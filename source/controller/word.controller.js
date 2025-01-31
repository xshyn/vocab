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
        res.redirect("/home-page")     
    } catch (error) {
        next(error)
    }

}
async function deleteWord (req , res , next) {
    try {
        const { id } = req.body
        const  result = await wordModel.deleteOne({_id: id})
        res.redirect('/home-page')
        
    } catch (err) {
        next(err)
    }
}
async function updateWord (req , res , next) {
    try {
        const { id , persian, english , pro, exp } = req.body
        const  result = await wordModel.updateOne({_id: id} , {
            $set: {
                persian:persian,
                english:english,
                pro:pro,
                exp:exp
            }
        })
        res.redirect('/home-page')
        
    } catch (err) {
        next(err)
    }
}

module.exports = {
    addWord,
    deleteWord,
    updateWord
}
