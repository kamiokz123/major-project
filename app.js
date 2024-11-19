const express = require("express");
const app = express();
const mongoose = require("mongoose");
const engine = require('ejs-mate');
const Listing = require("./models/listing.js");
const path = require("path");
let methodOverride = require('method-override')


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set the 'public' folder as the directory for serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);




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

// new route
app.get("/listings/new",(req,res)=>{
    res.render("./listing/new.ejs");
});


// show indivisual route
app.get("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    const list = await Listing.findById(id);
    console.log(list);
    res.render("./listing/show.ejs",{list});
});

// adding new list
app.post("/listings",async (req,res)=>{
    console.log(req.body.listing);
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// edit route
app.get("/listings/:id/edit",async(req,res)=>{
    const {id} = req.params;
    const list = await Listing.findById(id);
    console.log(list);
    res.render("./listing/edit.ejs",{list})
});

// update route
app.put("/listings/:id",async (req,res)=>{
    const {id} = req.params;
    const updatedList = req.body.listing;
    console.log({...updatedList,image:{filename:"",url:""}});
    const list = await Listing.findByIdAndUpdate(id,{...updatedList,image:{filename:"",url:""}});
    res.redirect(`/listings/${id}`)
});

app.delete("/listings/:id",async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`)
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
