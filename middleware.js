const Listing = require("./models/listing");
const Review = require("./models/review");
const { Listingschema , ReviewSchema } = require("./schema.js")
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to add listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}

module.exports.isowner=async(req,res,next)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.CurrentUser._id)) {
      req.flash("error", "You are not the owner of the listing so dont have access to edit/delete listings");
      return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    const { error } = Listingschema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    }
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    const { id,reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author.equals(res.locals.CurrentUser._id)) {
      req.flash("error", "You are not the Author of the Review so dont have access to delete listings");
      return res.redirect(`/listings/${id}`);
    }
    next()
}