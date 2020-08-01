if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const app = express();

app.use(
  session({
    secret: "HxSw23%sa",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// connect to mongoose
mongoose
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((e) => console.log(e));

const User = require(__dirname + "/models/Users");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// -------------------------------- Home Route ------------------------------ //
app.use("/", require(__dirname + "/routes/home"));

app.listen(process.env.PORT || 3000, console.log("Listening on port 3000"));
