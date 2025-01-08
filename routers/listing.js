const express = require("express");
const router = express.Router();
const asyncWraper = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn , isListOwner  } = require("../middlewares.js");
const { showAllListings, newListForm, showListItem, createNewListing, editListingForm, updateListing, deleteListing } = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloud/config.js");
const upload = multer({ storage });


const validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

router.route("/")
// show all listing route
.get(asyncWraper(showAllListings))
// adding new list
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    asyncWraper(createNewListing)
);




// new route
router.get("/new", isLoggedIn, newListForm);


router.route("/:id")
// show indivisual route
.get(asyncWraper(showListItem))
// update route
.put(
    isLoggedIn,
    isListOwner,
    upload.single('listing[image]'),
    validateListing,
    asyncWraper(updateListing))
.delete(isLoggedIn, isListOwner, asyncWraper(deleteListing));



// edit route
router.get("/:id/edit", isLoggedIn,isListOwner, asyncWraper(editListingForm));


module.exports = router;