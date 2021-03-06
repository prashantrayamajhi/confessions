const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./../models/Users");
const passport = require("passport");
const Confession = require("./../models/Confessions");

router.get("/", checkAuthenticated, (req, res) => {
  Confession.find((err, confessions) => {
    if (err) {
      console.log(err);
    } else {
      if (req.user.role !== "admin") {
        res.render("user/home", {
          confessions,
        });
      } else {
        res.render("admin/home", { role: req.user.role });
      }
    }
  });
});

router.get("/signup", checkDeAuthenticated, (req, res) => {
  res.render("signup");
});

router.get("/login", checkDeAuthenticated, (req, res) => {
  res.render("login");
});
// functions

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function checkDeAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("user/");
  } else {
    next();
  }
}

// post requests

router.post("/signup", (req, res) => {
  const errors = [];
  let { username, password, confirm_password } = req.body;
  username = username.trim();
  username = username.toLowerCase();
  password = password.trim();
  confirm_password = confirm_password.trim();

  if (password.length < 4 || password === "") {
    errors.push({ msg: "Password too short!" });
  }

  if (password !== confirm_password) {
    errors.push({ msg: "Passwords don't match!  " });
  }
  if (username.length < 4 || username === "") {
    errors.push({ msg: "Username too short!" });
  }

  if (errors.length > 0) {
    res.render("signup", {
      errors,
      username,
      password,
      confirm_password,
    });
  } else {
    User.findOne({ username: username }, (err, user) => {
      if (user) {
        errors.push({ msg: "Username is already taken!" });
        res.render("signup", {
          errors,
          username,
          password,
          confirm_password,
        });
      } else {
        const newUser = new User({
          username: username,
          password: password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/login");
              })
              .catch((e) => {
                console.log(e);
              });
          });
        });
      }
    });
  }
});

// ------------------------------------------------------------ //
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;
