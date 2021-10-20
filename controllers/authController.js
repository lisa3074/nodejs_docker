const User = require("../model/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashpwd = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashpwd,
    });
    res.status(201).json({
      status: "succes",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "FAIL",
    });
  }
};
exports.logIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }
    const isPwdCorrect = await bcrypt.compare(password, user.password);

    if (isPwdCorrect) {
      res.status(200).json({
        status: "succes",
      });
    } else {
      res.status(400).json({
        status: "Fail",
        message: "incorrect username or password.",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "FAIL",
    });
  }
};
