const express = require("express");
const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  res.render("user/home.ejs");
});

router.get("/submit", (req, res) => {
  res.render("user/submit");
});

// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.render("login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

function checkDeAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
}

//////////////////// post requests //////////////////////////
router.post("/submit", (req, res) => {
  const errors = [];
  let title = req.body.title;
  let confession = req.body.confession;

  title = title.trim();
  confession = title.trim();

  if (title === "") {
    errors.push({ msg: "Title cannot be empty" });
  }

  if (confession === "") {
    errors.push({ msg: "Confession cannot be empty" });
  }

  if (errors.length > 0) {
    res.render("user/submit", { errors, title, confession });
  }
});

module.exports = router;
