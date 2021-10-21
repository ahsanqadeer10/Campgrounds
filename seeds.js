var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require('./models/comment')

var data = [{
    "name": "Adam",
    "image": "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "description": "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis."
}, {
    "name": "White Bird in a Blizzard",
        "image": "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "description": "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet."
}, {
    "name": "Rehearsals for Extinct Anatomies",
        "image": "https://images.unsplash.com/photo-1474984815137-e129646c7c9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "description": "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus."
}, {
    "name": "Outside the Law (Hors-la-loi)",
        "image": "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "description": "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi."
}];

function seedDB(){
    // REMOVE ALL CAMPGROUNDS
    Campground.remove({}, function (err) {
        if (err) {
            console.log("removed campgrounds!");
        } else {
            // ADD NEW CAMPGROUNDS
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground!");
                        // CREATE A COMMENT
                        Comment.create({
                            text: "Good place but no internet",
                            author: "Homer"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else 
                            {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment!");
                            }
                        })
                    }
                });
            });
        }
    });
}

module.exports = seedDB;