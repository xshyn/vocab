const { wordModel } = require("../model/word.model")

async function addWord (req , res , next) {
    try {
        const {persian, english, pro} = req.body
        const result = await wordModel.create({
            persian,
            english,
            pro
        })
        res.send(result)
        
    } catch (error) {
        next(error)
    }

}
async function deleteWord (req , res , next) {
}
async function updateWord (req , res , next) {
}
async function updateWord (req , res , next) {
}

module.exports = {
    addWord
}
