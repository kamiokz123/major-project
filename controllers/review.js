const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;

    const listItem = await Listing.findById(id);
    const newReview = new Review(review);
    newReview.author = req.user;
    listItem.reviews.push(newReview);

    await newReview.save();
    await listItem.save();
    req.flash("success","new review added!");
    res.redirect(`/listings/${id}`)
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);
};