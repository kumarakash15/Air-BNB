const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js")

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            username: username,
            email: email
        });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, ((err) => {
            if (err) return next(err);
            req.flash("success", "You are Registerd!");
            res.redirect("/listings")
        }))
    } catch (err) {
        req.flash("error", err.message)
        res.redirect("/signup")
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})
router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),(req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;