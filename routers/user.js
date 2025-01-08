const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWraper = require("../utils/asyncWrap.js");
const User = require("../models/user.js");
const passport = require("passport");
const { signupForm, signup, login, logout } = require("../controllers/user.js");


router.route("/signup")
.get( signupForm)
.post(asyncWraper(signup));

router.route("/login")
.get((req, res) => {
    res.render("./user/login.ejs");
})
.post(login);


router.get('/logout', logout);

module.exports = router;