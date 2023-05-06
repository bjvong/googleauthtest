const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("./src/config/google");

const port = process.env.PORT || 8050;
const db = process.env.MONGO_URI;
mongoose.connect(
  db,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (error) => {
    if (error) console.log(error);
  }
);


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
  

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


const server = app.listen(port, function() {
    console.log('Server is listening on port ' + port);
});
