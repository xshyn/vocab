const { Router } = require("express");
const { addWord, deleteWord, updateWord, searchWord } = require("../controller/word.controller");

const router = Router()

router.post("/add" , addWord)
router.post("/delete" , deleteWord)
router.post("/update" , updateWord)
router.post("/search" , searchWord)

module.exports = {
    wordRouter: router
}