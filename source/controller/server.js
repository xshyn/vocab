const express = require("express")

const app = express()

app.get('/' , (req , res) => {
    res.send("hello")
})

app.listen(process.env.SERVER_PORT , () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`);
})