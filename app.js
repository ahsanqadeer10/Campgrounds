var express = require("./node_modules/express"),
	app = express(),
	bodyParser = require("./node_modules/body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("./node_modules/passport/lib"),
	LocalStrategy = require("./node_modules/passport-local/lib"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground.js"),
	Comment = require("./models/comment.js"),
	User = require("./models/user.js");
seedDB = require("./seeds.js");

//  REQUIRE ROUTE FILES
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/auth");

mongoose.connect(
	"mongodb+srv://ahsan:ahsan123@cluster0.rhd1n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	}
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
	console.log("Connected successfully");
});

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//  SEED THE DATABASE
// seedDB();

app.locals.moment = require("moment");

//  PASSPORT CONFIG
app.use(
	require("./node_modules/express-session")({
		secret: "You're breathtaking!",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(8000, () =>
	console.log("The YelpCamp v5 Server Has Started On PORT:8000")
);
