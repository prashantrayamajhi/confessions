if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");

const app = express();
app.use(flash());

require("./config/passport")(passport);

app.use(
  session({
    secret: "HxSw23%sa",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  next();
});

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
app.use("/user", require(__dirname + "/routes/user"));

app.listen(process.env.PORT || 3000, () =>
  console.log("Listening on port 3000")
);
