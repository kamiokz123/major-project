const mongoose = require("mongoose");
const { type } = require("../schema");
const { ref } = require("joi");
const Review = require("../models/review.js")
const Schema = mongoose.Schema;



const listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: {
            filename: String,
            url: String
        },
        default: {
            filename: "defaultimage",
            url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/324792773.jpg?k=afd8d85cd39b3f383e59a57c99312e213126fdb4107a3349ef907ec3476d3ee7&o=&hp=1"
        },
        set: (v) => {
            if (!v || !v.url) {
                return {
                    filename: "defaultimage",
                    url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/324792773.jpg?k=afd8d85cd39b3f383e59a57c99312e213126fdb4107a3349ef907ec3476d3ee7&o=&hp=1"
                };
            }
            return v;
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type : Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete",async(list)=>{
    if (list) {
        await Review.deleteMany({_id : {$in : list.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

