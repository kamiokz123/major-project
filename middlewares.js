const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();  // Proceed to the next middleware/route
    }
    req.session.returnTo = req.originalUrl;        
    req.flash('error', 'You must be logged in to access this page');
    res.redirect('/login');  // Redirect to login if not authenticated
}

module.exports.isListOwner = async (req, res, next) => {
    const { id } = req.params;
    const listItem = await Listing.findById(id);
    if (req.user && !listItem.owner.equals(req.user._id)) {
        req.flash("error", "only owner have access");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id , reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (req.user && !review.author.equals(req.user._id)) {
        req.flash("error", "only owner have access");
        return res.redirect(`/listings/${id}`);
    }
    next();
};