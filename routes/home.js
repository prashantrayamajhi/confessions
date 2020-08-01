const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./../models/Users");

router.get("/", (req, res) => {
  res.render("home.ejs");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

// post requests
router.post("/signup", (req, res) => {
  const errors = [];
  let { username, password, confirm_password } = req.body;
  username = username.trim();
  password = password.trim();
  confirm_password = confirm_password.trim();

  if (password.length < 6 || password === "") {
    errors.push({ msg: "Password too short!" });
  }

  if (password !== confirm_password) {
    errors.push({ msg: "Passwords don't match!  " });
  }
  if (username.length < 5 || username === "") {
    errors.push({ msg: "Invalid username!" });
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

router.post("/login", (req, res) => {});

module.exports = router;
