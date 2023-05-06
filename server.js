const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");

require("./src/config/google");
require("./src/config/passport");

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

app.get("/auth/logout", (req, res) => {
    req.flash("success", "Successfully logged out");
    req.session.destroy(function () {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });

  app.get("/g", (req, res) => {
    res.render("google.ejs");
  });
  
  app.get("/", (req, res) => {
    res.render("index.ejs");
  });
  
  app.get("/local/signup", (req, res) => {
    res.render("local/signup.ejs");
  });
  
  app.get("/local/signin", (req, res) => {
    res.render("local/signin.ejs");
  });

app.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile.ejs", { user: req.user });
  });

  app.post("/auth/local/signup", async (req, res) => {
    const { first_name, last_name, email, password } = req.body
  
    if (password.length < 8) {
      req.flash("error", "Account not created. Password must be 7+ characters long");
      return res.redirect("/local/signup");
    }
  
    const hashedPassword = await bcrypt.hash(password, 10)
  
    try {
      await UserService.addLocalUser({
        id: uuid.v4(),
        email,
        firstName: first_name,
        lastName: last_name,
        password: hashedPassword
      })
    } catch (e) {
      req.flash("error", "Error creating a new account. Try a different login method.");
      res.redirect("/local/signup")
    }
  
    res.redirect("/local/signin")
  });
  
  app.post("/auth/local/signin",
    passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/local/signin",
      failureFlash: true
    })
  );
  

const server = app.listen(port, function() {
    console.log('Server is listening on port ' + port);
});
