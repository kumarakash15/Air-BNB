const User = require("../models/user");

module.exports.RenderNewUserForm=(req, res) => {
    res.render("users/signup.ejs")
};
module.exports.AddUser=async (req, res) => {
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
};

module.exports.RenderUserLoginForm=(req, res) => {
    res.render("users/login.ejs")
};
module.exports.LoginUser=(req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.LogoutUser=(req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};