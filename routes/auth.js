var express = require('../node_modules/express');
var router = express.Router();
var passport = require('../node_modules/passport/lib');
var User = require("../models/user");
var middleware = require("../middleware")
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');


//  ROOT ROUTE
router.get("/", function (req, res) {
    res.render("landing");
});

//  SHOW REGISTER FORM
router.get("/register", function (req, res) {
    res.render("register");
});

//  SIGN-UP LOGIC
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    if (req.body.adminCode == "abcde") {
        newUser.isAdmin = true;
    };
    eval("require('locus')");
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message + "!");
            res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                if (newUser.isAdmin == true) {
                    req.flash("success", "Welcome to Yelpcamp, " + user.username + "! You have signed up as an admin.");
                } else {
                    req.flash("success", "Welcome to Yelpcamp, " + user.username + "!");
                }
                res.redirect("/campgrounds");
            });
        }
    });
});

//  LOGIN FORM
router.get("/login", function (req, res) {
    res.render("login");
});

//  LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
});

//  LOGOUT ROUTE
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
});

router.get('/forgot', function(req, res){
    res.render("forgot");
});

module.exports = router;