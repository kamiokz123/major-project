const express = require("express");
const router = express.Router({mergeParams:true});
const asyncWraper = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchemaJoi} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middlewares.js");
const { addReview, destroyReview } = require("../controllers/review.js");



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

router.post("/", isLoggedIn, validateReview, asyncWraper(addReview));

// delete review 
router.delete("/:reviewId", isLoggedIn, isReviewAuthor , asyncWraper(destroyReview));


module.exports = router;