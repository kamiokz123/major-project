if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const engine = require('ejs-mate');
const path = require("path");
let methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routers/listing.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js")
const cookieParser = require("cookie-parser");
const MongoStore = require('connect-mongo');
const expressSession = require("express-session");
const flash = require("connect-flash");
// requires the model with Passport-Local Mongoose plugged in
const User = require('./models/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const dbUrl = process.env.ATLAS_URL;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set the 'public' folder as the directory for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRETE
    },
    touchAfter: 24 * 3600
})

store.on('error', (error) => {
    console.error('Error in MongoDB session store:', error);
});

app.use(expressSession({
    store,
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
app.use(flash());
// use ejs-locals for all ejs templates:
app.engine('ejs', engine);


app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}



// app.get("/demouser", async (req, res) => {
//     const fakeUser = User({
//         email:"abc@gmail.com",
//         username:"web123"
//     });

//     let newUser = await User.register(fakeUser,"hello");
//     res.send(newUser);
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/",(req,res)=>{
    if (req.user) {
        res.redirect("/listings")
    }else{
        res.redirect("/login")
    }
});

// listing routes
app.use("/listings", listingRouter);

// review routes
app.use("/listings/:id/reviews", reviewRouter);

// user routes
app.use("/", userRouter);

// error handling middlewares
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "some error occured" } = err;
    console.log(err);
    res.status(statusCode).render("./error.ejs", { message });
});

app.listen(8080, () => {
    console.log("listening on 8080");
});