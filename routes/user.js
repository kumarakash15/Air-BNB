const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');

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
        console.log(registerUser)
        req.flash("success", "You are Registerd!");
        res.redirect("/login")
    } catch (err) {
        req.flash("error", err.message)
        res.redirect("/signup")
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login",passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}),async(req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    res.redirect("/listings")
});

module.exports = router;