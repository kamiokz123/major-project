const express = require("express");
const router = express.Router();
const asyncWraper = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const listingSchema = require("../schema.js");


const validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};


// show all listing route
router.get("/", asyncWraper(async (req, res) => {
    const allList = await Listing.find();
    // console.log(allList);
    res.render("./listing/index.ejs", { allList });
}));

// new route
router.get("/new", (req, res) => {
    res.render("./listing/new.ejs");
});


// show indivisual route
router.get("/:id", asyncWraper(async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");
    res.render("./listing/show.ejs", { list });
}));

// adding new list
router.post("/", validateListing, asyncWraper(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// edit route
router.get("/:id/edit", asyncWraper(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    console.log(list);
    res.render("./listing/edit.ejs", { list })
}));

// update route
router.put("/:id", validateListing, asyncWraper(async (req, res) => {
    const { id } = req.params;
    const updatedList = req.body.listing;
    const list = await Listing.findByIdAndUpdate(id, { ...updatedList, image: { filename: "", url: "" } });
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", asyncWraper(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`)
}));

module.exports = router;