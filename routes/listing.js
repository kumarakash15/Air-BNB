const express=require('express');
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedin , isowner , validateListing} =require("../middleware.js");
const Listingcontroller=require("../contrrollers/listing.js")

router.get("/", wrapAsync(Listingcontroller.index));

//new route
router.get("/new",isLoggedin,Listingcontroller.renderNewform)
router.post("/", validateListing,wrapAsync(Listingcontroller.newListing))

//show route
router.get("/:id", wrapAsync(Listingcontroller.ShowListing));

//edit route
router.get("/:id/edit",isLoggedin,isowner, wrapAsync(Listingcontroller.RenderEditForm));
router.put("/:id",isLoggedin,isowner, validateListing,wrapAsync(Listingcontroller.UpdateListing))

//delete route
router.delete("/:id",isLoggedin,isowner, wrapAsync(Listingcontroller.DeleteListing))

module.exports=router;