const Workout = require("../models/Workout");
const Name = require("../models/Name");
const GymUser = require("../models/GymUser");
const Age = require("../models/Age");
const CurrentLevel = require("../models/CurrentLevel");
const bodyParser = require("body-parser");
const { findById } = require("../models/Name");

exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;
  try {
    const workouts = await GymUser.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await GymUser.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);
    res.render("workouts", {
      workouts: workouts,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message
    });
  } catch (e) {
    res.status(404).send({ message: "could not list workouts" });
  }
};
exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const names = await Name.find({});
    const GymUsers = await GymUser.find({});
    const ages = await Age.find({});
    const workout = await Workout.findById(id);
    if (!workout) throw Error('cant find workout');
    res.render('update-workout', {
      ages: ages,
      workout: workout,
      names: names,
      GymUsers: GymUsers,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('create-workout', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could find gym user ${id}`,
    });
  }
};
exports.create = async (req, res) => {
  try {
    const GymUser = await GymUser.findById(req.body.GymUser_id);
    await Workout.create({
      title: req.body.title,
      GymUser_name: GymUser.name,
      GymUser_twitter_handle: GymUser.twitter_handle,
      points: parseInt(req.body.points),
      GymUser_id: req.body.GymUser_id,
      ages: req.body.ages
    })
    res.redirect('/workouts/?message=workout has been created')
  } catch (e) {
    if (e.errors) {
      res.render('create-workout', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}
exports.createView = async (req, res) => {
  try {
    const names = await Name.find({});
    const GymUsers = await GymUser.find({});
    const ages = await Age.find({});
    res.render("create-workout", {
      names: names,
      GymUsers: GymUsers,
      ages: ages,
      errors: {}
    });
  } catch (e) {
    res.status(404).send({
      message: `could not generate data`,
    });
  }
}
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Workout.findByIdAndRemove(id);
    res.redirect("/workouts");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}.`,
    });
  }
};