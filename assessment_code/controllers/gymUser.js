const GymUser = require("../models/GymUser");
exports.list = async (req, res) => {
  try {
    console.log(req.query)
    const message = req.query.message;
    const GymUsers = await GymUser.find({});
    res.render("GymUsers", { gymUsers: GymUsers, message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list Gym Users" });
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await GymUser.findByIdAndRemove(id);
    res.redirect("/GymUsers");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const Gymuser = new GymUser({ name: req.body.name, twitter: req.body.twitter });
    await Gymuser.save();
    res.redirect('/GymUsers/?message=GymUser has been created')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-GymUser', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}
exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const gymuser = await GymUser.findById(id);
    res.render('update-GymUser', { GymUser: GymUser, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find Gym User ${id}.`,
    });
  }
};
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const gymUser = await GymUser.updateOne({ _id: id }, req.body);
    res.redirect('/GymUsers/?message=GymUser has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find Gym User ${id}.`,
    });
  }
};