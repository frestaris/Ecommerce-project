const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  try {
    const { name, picture, email } = req.user;

    const user = await User.findOneAndUpdate(
      { email: email },
      { name: email.split("@")[0], picture: picture },
      { new: true }
    );
    if (user) {
      console.log("USER UPDATED", user);
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        name: email.split("@")[0],
        picture,
      }).save();
      console.log("USER CREATED", newUser);

      res.json(newUser);
    }
  } catch (error) {
    console.error("Error in createOrUpdateUser controller:", error);
    res.status(500).json({ err: "Server error" });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) throw new Error("no user was found with that email");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
