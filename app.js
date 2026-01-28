const expreess = require("express");
const app = expreess();
const mongoose = require('mongoose');
const port = 5500;
const ExpressError = require("./utils/ExpressError");
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listings = require("./routes/listing");
const Reviews = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(expreess.json());
app.use(expreess.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expreess.static(path.join(__dirname, "public")));

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(mongo_url);
}

const sesssionOption={
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
};

app.get("/", (req, res) => {
    res.send("hii i am root");
})

app.use(session(sesssionOption));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("Error");
    next();
});
app.use("/listings", Listings);
app.use("/listings/:id/reviews", Reviews);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "internal server error!" } = err;
    res.render("./listings/error.ejs", { status, message })
})

app.listen(port, () => {
    console.log(`app listing on port ${port}`);
})