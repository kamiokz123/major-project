const express = require("express");
const app = express();
const mongoose = require("mongoose");
const engine = require('ejs-mate');
const path = require("path");
let methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set the 'public' folder as the directory for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSession({secret:"supersecrete"}));

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);


main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}



app.get("/", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send("hi : "+req.session.count);
});

// listing routes
app.use("/listings",listingRouter);

// review routes
app.use("/listings/:id/reviews",reviewRouter);

// error handling middlewares
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "some error occured" } = err;
    res.status(statusCode).render("./error.ejs", { message });
});

app.listen(8080, () => {
    console.log("listening on 8080");
});