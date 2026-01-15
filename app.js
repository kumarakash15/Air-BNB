const expreess = require("express");
const app = expreess();
const mongoose = require('mongoose');
const port = 5500;
const Listing = require("./models/listing");
const Review = require("./models/review");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { Listingschema,ReviewSchema } = require("./schema.js")
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const review = require("./models/review");
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

const validateListing = (req, res, next) => {
    const { error } = Listingschema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    }
    next();
};

const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    }
    next();
};

app.get("/", (req, res) => {
    res.send("hii i am root");
})

app.get("/listings", wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({})
    res.render("./listings/index.ejs", { alllistings })
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs")
})
app.post("/listings", validateListing,wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.Listing);
    await newlisting.save();
    res.redirect("/listings")
}))

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing })
}))
app.put("/listings/:id", validateListing,wrapAsync(async (req, res) => {
    if (!req.body.Listing) {
        throw new ExpressError(400, "Send Valid data for Listings")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    res.redirect(`/listings/${id}`);
}))

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

//Reviews
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

app.delete("/listings/:id/reviews/:reviewid", wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}));

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