const express = require("express");
const router = express.Router({mergeParams:true});
const asyncWraper = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewSchemaJoi = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    const result = reviewSchemaJoi.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}


// reviews 
// add review route

router.post("/", validateReview, asyncWraper(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;

    const listItem = await Listing.findById(id);
    const newReview = new Review(review);
    listItem.reviews.push(newReview);

    await newReview.save();
    await listItem.save();

    res.redirect(`/listings/${id}`)
}));

// delete review 
router.delete("/:reviewId", asyncWraper(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(id, reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;