// Import nesecery things
require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const { csrfSync } = require("csrf-sync");
const compression = require("compression");

const mongoose = require("mongoose");
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@quizapp.gmzsr.mongodb.net/${process.env.MONGO_DEFAULT_DB}`;

const flash = require("connect-flash");

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collextion: "sessions",
});

// Set csrf protection
const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => req.body["CSRFToken"],
});

// Set ejs as view engine
app.set("view engine", "ejs");
app.set("views", "views");

const defaultRoutes = require("./routes/default");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
const leagueRoutes = require("./routes/league");
const teamRoutes = require("./routes/team");
const questRoutes = require("./routes/quest");
const userRoutes = require("./routes/user");
const errorRoutes = require("./routes/error");

app.use(compression());

// Tell app that we are using express and where to find it
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

// Create session in our app
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfSynchronisedProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    if (res.locals.isAuthenticated && req.session.user) {
      res.locals.role = req.session.user.role;
    } else {
      res.locals.role = "guest";
    }
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(defaultRoutes);
app.use(authRoutes);
app.use(eventRoutes);
app.use(leagueRoutes);
app.use(teamRoutes);
app.use(questRoutes);
app.use(userRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
  const httpStatusCode = error.httpStatusCode ? error.httpStatusCode : 500;

  res.status(httpStatusCode).render("error/500error", {
    pageTitle: "Error!",
    path: "/500",
    errorMsg: error,
    isAuthenticated: !!req.session?.isLoggedIn,
    user: req.session.user,
    role: req.session.user ? req.session.user.role : "guest",
    csrfToken: req.csrfToken(),
  });
});

// Connect app to database and run it
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });