const express = require("express");
const router = express.Router();
const passport = require("passport");
const url = require("url");
const Confession = require("./../models/Confessions");
const Users = require("./../models/Users");

router.get("/", checkAuthenticated, checkAdmin, (req, res) => {
  res.render("admin/home");
});

router.get("/posts", checkAuthenticated, checkAdmin, (req, res) => {
  Confession.find((err, confessions) => {
    res.render("admin/posts", {
      confessions,
    });
  });
});

router.get("/users", checkAuthenticated, checkAdmin, (req, res) => {
  Users.find((err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/users", { user: user });
    }
  });
});

router.get("/delete/:id", checkAuthenticated, checkAdmin, (req, res) => {
  Users.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      req.redirect(url.parse(req.url).pathname);
    }
  });
});

router.get(
  "/delete_post_admin/:id",
  checkAuthenticated,
  checkAdmin,
  (req, res) => {
    Announcement.findByIdAndDelete(req.params.id, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        res.render("login");
      }
    });
  }
);

router.get("/delete_post/:id", checkAuthenticated, checkAdmin, (req, res) => {
  Confession.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("back");
    }
  });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.render("login");
});

/////////// post requests ///////////////////

router.post("/submit", checkAuthenticated, checkAdmin, (req, res) => {
  const errors = [];

  let title = req.body.title;
  let confession = req.body.confession;
  let level = req.body.level;
  confession = confession.trim();

  if (confession === "") {
    errors.push({ msg: "Announcements Cannot be Empty!" });
  }

  if (errors.length > 0) {
    res.render("admin/home", { errors, confession });
  } else {
    let a = new Confession({
      title: title,
      confession: confession,
      level: level,
    });
    a.save().then(() => {
      res.redirect("back");
    });
  }
});

////////////////////////// functions /////////////////////////////////

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("back");
  }
}

function checkAdmin(req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    res.redirect("back");
  }
}

function checkDeAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("");
  } else {
    next();
  }
}

module.exports = router;
