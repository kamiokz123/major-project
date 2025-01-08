const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");



main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((list)=>{
        return {...list,owner:'6771a420d127b3752144db45'};
    });
    await Listing.insertMany(initData.data);
    console.log("data added");
}

initDB();