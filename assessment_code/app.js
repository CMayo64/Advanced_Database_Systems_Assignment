require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const User = require("./models/User");

//Controllers 
const gymUserController = require("./controllers/gymUser");
const workoutController = require("./controllers/workout");
const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const app = express();
app.set("view engine", "ejs");

//Pulling the values from environment
const { PORT, MONGODB_URI } = process.env;

//Connect to database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

//Applying middlewear
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
saveUninitialized: true;
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }));
app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}
app.get("/", homeController.list);
app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})
app.get("/create-gymUser", authMiddleware, (req, res) => {
  res.render("create-gymUser", { errors: {} });
});
app.post("/create-gymUser", gymUserController.create);
app.get("/gymUsers", gymUserController.list);
app.get("/gymUsers/delete/:id", gymUserController.delete);
app.get("/gymUsers/update/:id", gymUserController.edit);
app.post("/gymUsers/update/:id", gymUserController.update);

app.get("/create-workout", workoutController.createView);
app.post("/create-workout", workoutController.create);
app.get("/update-workout/:id", workoutController.edit);

app.get("/workouts", workoutController.list);
app.get("/workouts/delete/:id", workoutController.delete);

app.get("/join", (req, res) => {
  res.render('create-user', { errors: {} })
});
app.post("/join", userController.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);
app.listen(PORT, () => {
  console.log(
    `Example app listening at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});