const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");

require("./src/config/google");

const port = process.env.PORT || 8050;
const db = process.env.MONGO_URI;
mongoose.connect(db);


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(
    session({
      secret: "secr3t",
      resave: false,
      saveUninitialized: true,
    })
  );

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
  
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
  };

app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/",
      successRedirect: "/profile",
      failureFlash: true,
      successFlash: "Successfully logged in!",
    })
  );

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

app.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile.ejs", { user: req.user });
  });


const server = app.listen(port, function() {
    console.log('Server is listening on port ' + port);
});
