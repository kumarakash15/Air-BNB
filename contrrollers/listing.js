const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");

//index route
module.exports.index=async (req, res) => {
    const alllistings = await Listing.find({})
    res.render("./listings/index.ejs", { alllistings })
};

//new route
module.exports.renderNewform=(req, res) => {
    res.render("./listings/new.ejs")
};
module.exports.newListing = async (req, res, next) => {
  const newListing = new Listing(req.body.Listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = {
      url: req.file.path, 
      filename: req.file.filename
    };
  }
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings");
};

//show route
module.exports.ShowListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
}

//edit route
module.exports.RenderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}
module.exports.UpdateListing=async (req, res) => {
    if (!req.body.Listing) {
        throw new ExpressError(400, "Send Valid data for Listings")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
};

//delete route
module.exports.DeleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
};