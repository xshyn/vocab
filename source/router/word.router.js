const { Router } = require("express");
const { addWord, deleteWord, updateWord } = require("../controller/word.controller");

const router = Router()

router.post("/add" , addWord)
router.delete("/delete" , deleteWord)
router.put("/update" , updateWord)

module.exports = {
    wordRouter: router
}