const passport = require("passport");
const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
    res.render("./user/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({
            username,
            email
        });
        const regUser = await User.register(newUser, password);
        req.login(regUser, function (err) {
            if (err) return next(err);
            req.flash('success', 'Logged in successfully');
            res.redirect("/listings");

        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.login = (req,res,next)=>{
    let returnTo = req.session.returnTo || '/listings'; 
    delete req.session.returnTo;
    
     passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: '/login'
    })(req, res,()=>{
        req.flash("success", "welcome to wanderlust!");
        res.redirect(returnTo);
    });
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully');
        res.redirect('/listings');
    });
};