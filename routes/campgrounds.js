var express = require('../node_modules/express');
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'ubelstag', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//  INDEX
router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log("Error!");
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    })
});

//  NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//  CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, price: price, description: desc, author: author};
    Campground.create(newCampground, function (err, addedCampground) {
        if (err) {
            console.log("Error!");
        }
        else {
            console.log(addedCampground);
            res.redirect("/campgrounds");
        }
    });
});

//  SHOW
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log("Error");
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//  EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res)
{
    Campground.findById(req.params.id, 
        function (err, foundCampground) 
        {
        res.render("campgrounds/edit", {campground: foundCampground });
        });
});

//  UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//  DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;