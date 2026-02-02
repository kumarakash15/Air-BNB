const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js")
const UserController=require("../contrrollers/user.js")

router.route("/signup")
.get(UserController.RenderNewUserForm)
.post(wrapAsync(UserController.AddUser));

router.route("/login")
.get(UserController.RenderUserLoginForm)
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),UserController.LoginUser);

router.get("/logout", UserController.LogoutUser);

module.exports = router;