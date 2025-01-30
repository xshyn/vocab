function login(req, res) {
    res.render("login")
}
function home(req , res) {
    res.render('home')
}
function profile(req , res) {
    res.render('profile')
}
function signup(req , res) {
    res.render('register')
}

module.exports = {
    login,
    home,
    profile,
    signup
}