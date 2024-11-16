const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }

app.get("/",(req,res)=>{
    res.send("root page");
});

// show all listing route
app.get("/listings",async (req,res)=>{
    const allList = await Listing.find();    
    res.render("./listing/index.ejs",{allList});
});

// show indivisual route
app.get("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    const list = await Listing.findById(id);
    console.log(list);
    res.render("./listing/show.ejs",{list});
});

// app.get("/newListing",async (req,res)=>{
//     const testList = new Listing({
//         title : "my dubai villa",
//         description : "by the beach",
//         price:2600,
//         location:"karachi , afghanistan",
//         country: "afghanistan"
//     });
//     await testList.save();
//     console.log("sample saved");
    
//     res.send("added new list")
// });

app.listen(8080,()=>{
    console.log("listening on 8080");
});
