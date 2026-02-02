const express=require('express');
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedin , isowner , validateListing} =require("../middleware.js");
const Listingcontroller=require("../contrrollers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(Listingcontroller.index))
.post(isLoggedin,validateListing,upload.single('Listing[image][url]'),wrapAsync(Listingcontroller.newListing))

router.get("/new",isLoggedin,Listingcontroller.renderNewform)

router.route("/:id")
.get(wrapAsync(Listingcontroller.ShowListing))
.put(isLoggedin,isowner, validateListing,wrapAsync(Listingcontroller.UpdateListing))
.delete(isLoggedin,isowner, wrapAsync(Listingcontroller.DeleteListing))

//edit route
router.get("/:id/edit",isLoggedin,isowner, wrapAsync(Listingcontroller.RenderEditForm));

module.exports=router;