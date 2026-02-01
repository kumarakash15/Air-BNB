const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js")
const UserController=require("../contrrollers/user.js")

router.get("/signup",UserController.RenderNewUserForm)
router.post("/signup", wrapAsync(UserController.AddUser));

router.get("/login", UserController.RenderUserLoginForm)
router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login",failureFlash: true,}),UserController.LoginUser);

router.get("/logout", UserController.LogoutUser);

module.exports = router;