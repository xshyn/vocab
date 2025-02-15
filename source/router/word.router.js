const { Router } = require("express");
const { addWord, deleteWord, updateWord, searchWord } = require("../controller/word.controller");
const { userLoged, ifAdminRedirect } = require("../middlewares");

const router = Router()

router.post("/add" , userLoged , ifAdminRedirect ,addWord)
router.post("/delete" , userLoged , ifAdminRedirect , deleteWord)
router.post("/update" , userLoged , ifAdminRedirect , updateWord)
router.post("/search" , userLoged , ifAdminRedirect , searchWord)

module.exports = {
    wordRouter: router
}