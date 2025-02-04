const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req , file, cb) {
        cb(null , "view/public/uploads")
    }, 
    filename : function (req , file, cb) {
        const ext = path.extname(file.originalname)
        const fileName = req.user._id + ext
        cb(null , fileName)
    } 
})

const upload = multer({storage})

module.exports = {
    upload
}