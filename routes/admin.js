const express = require("express");
const router = express.Router();
const passport = require("passport");
const url = require("url");
const Confession = require("./../models/Confessions");
const Users = require("./../models/Users");
const Announcement = require("./../models/Announcement");

let announcementsCollection = [];

router.get("/", checkAuthenticated, checkAdmin, (req, res) => {
  console.log(req.user.role);
  res.render("admin/home");
});

router.get("/posts", checkAuthenticated, checkAdmin, (req, res) => {
  announcementsCollection = [];
  Announcement.find((err, a) => {
    if (err) {
      console.log(err);
    } else {
      announcementsCollection.push(a);
    }
  });
  Confession.find((err, confessions) => {
    res.render("admin/posts", {
      confessions,
      announcement: announcementsCollection,
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
        req.render("back");
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
  let announcement = req.body.announcement;
  announcement = announcement.trim();

  if (announcement === "") {
    errors.push({ msg: "Announcements Cannot be Empty!" });
  }

  if (errors.length > 0) {
    res.render("admin/home", { errors, announcement });
  } else {
    let a = new Announcement({
      content: announcement,
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
