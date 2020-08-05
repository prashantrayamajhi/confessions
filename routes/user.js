const express = require("express");
const router = express.Router();
const Confession = require("./../models/Confessions");

router.get("/", checkAuthenticated, (req, res) => {
  Confession.find((err, confessions) => {
    if (err) {
      console.log(err);
    } else {
      res.render("user/home.ejs", {
        confessions: confessions,
      });
    }
  });
});

router.get("/submit", (req, res) => {
  const username = req.user.username;
  res.render("user/submit", { username: username });
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
  let username = req.body.username;
  console.log(username);
  title = title.trim();
  confession = confession.trim();

  if (title === "" || title === undefined) {
    errors.push({ msg: "Title cannot be empty" });
  }

  if (title.length >= 55) {
    errors.push({ msg: "Title too long!" });
  }

  if (confession === "" || confession === undefined) {
    errors.push({ msg: "Confession cannot be empty" });
  }

  if (errors.length > 0) {
    res.render("user/submit", { errors, title, confession });
  } else {
    const c = new Confession({
      title: title,
      confession: confession,
      username: username,
    });
    c.save()
      .then((text) => {
        res.redirect("/login");
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

module.exports = router;
