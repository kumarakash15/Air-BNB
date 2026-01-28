const express=require('express');
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { Listingschema } = require("../schema.js")
const Listing = require("../models/listing");

const validateListing = (req, res, next) => {
    const { error } = Listingschema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    }
    next();
};

router.get("/", wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({})
    res.render("./listings/index.ejs", { alllistings })
}));

//new route
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs")
})
router.post("/", validateListing,wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.Listing);
    await newlisting.save();
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings")
}))

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("Error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { listing });
}));

//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("Error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("./listings/edit.ejs", { listing });
}));
router.put("/:id", validateListing,wrapAsync(async (req, res) => {
    if (!req.body.Listing) {
        throw new ExpressError(400, "Send Valid data for Listings")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}))

module.exports=router;