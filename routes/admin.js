const express = require("express");
const router = express.Router();
const passport = require("passport");
const Confession = require("./../models/Confessions");
const Users = require("./../models/Users");
const Announcement = require("./../models/Announcement");

router.get("/", (req, res) => {
  res.render("admin/home");
});

router.get("/posts", (req, res) => {
  Confession.find((err, confessions) => {
    res.render("admin/posts", { confessions });
  });
});
router.get("/users", (req, res) => {
  Users.find((err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/users", { user: user });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  Users.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect(req.get("referer"));
    }
  });
});

router.get("/delete_post/:id", (req, res) => {
  Confession.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect(req.get("referer"));
    }
  });
});

/////////// post requests ///////////////////

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "admin/",
//     failureRedirect: "admin/login",
//     failureFlash: true,
//   })(req, res, next);
// });

////////////////////////// functions /////////////////////////////////

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("admin/login");
  }
}

function checkDeAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("admin/");
  } else {
    next();
  }
}

module.exports = router;
