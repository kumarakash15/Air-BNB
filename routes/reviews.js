const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const {validateReview,isLoggedin,isReviewAuthor} =require("../middleware.js");
const ReviewsController=require("../contrrollers/reviews.js")

//Reviews
router.post("/",isLoggedin,validateReview, wrapAsync(ReviewsController.AddReviews));

router.delete("/:reviewid",isLoggedin,isReviewAuthor, wrapAsync(ReviewsController.DeleteReviews));

module.exports = router;