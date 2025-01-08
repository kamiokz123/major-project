const Listing = require("../models/listing");


module.exports.showAllListings = async (req, res) => {
    const allList = await Listing.find();
    res.render("./listing/index.ejs", { allList });
};


module.exports.newListForm = (req, res) => {
    res.render("./listing/new.ejs");
};


module.exports.showListItem = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id).populate("reviews").populate({
        path: "reviews",
        populate: "author"
    }).populate("owner");

    if (!list) {
        req.flash("error", "listing you request for does not exist!");
        res.redirect("/listings")
    } else {
        res.render("./listing/show.ejs", { list });
    }
};


module.exports.createNewListing = async (req, res, next) => {

    const newListing = new Listing(req.body.listing);
    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        newListing.image.url = url;
        newListing.image.filename = filename;
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new list created!");
    res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    console.log("render in list :", list);
    
    if (!list) {
        req.flash("error", "listing you request for does not exist!");
        res.redirect("/listings")
    } else {
        
        res.render("./listing/edit.ejs", { list })
    }
};

module.exports.updateListing = async (req, res, next) => {  // Add 'next' here
    try {
        const { id } = req.params;
        const updatedList = req.body.listing;
        console.log({...updatedList});
        
        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            await Listing.findByIdAndUpdate(id, { ...updatedList, image: { filename, url } });
        } else {
            await Listing.findByIdAndUpdate(id, { ...updatedList });
        }

        req.flash("success", "list item updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);  // Pass error to express error handler
    }
};


module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "list item deleted!")
    res.redirect(`/listings`)
};