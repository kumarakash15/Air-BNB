const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.AddReviews=async (req, res) => {
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review added Successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.DeleteReviews=async (req, res) => {
    let { id, reviewid } = req.params;
    await Review.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};