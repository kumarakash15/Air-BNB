const express=require('express');
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const {isLoggedin , isowner , validateListing} =require("../middleware.js");

router.get("/", wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({})
    res.render("./listings/index.ejs", { alllistings })
}));

//new route
router.get("/new",isLoggedin,(req, res) => {
    res.render("./listings/new.ejs")
})
router.post("/", validateListing,wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.Listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings")
}))

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
}));

//edit route
router.get("/:id/edit",isLoggedin,isowner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("./listings/edit.ejs", { listing });
}));
router.put("/:id",isLoggedin,isowner, validateListing,wrapAsync(async (req, res) => {
    if (!req.body.Listing) {
        throw new ExpressError(400, "Send Valid data for Listings")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",isLoggedin,isowner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}))

module.exports=router;