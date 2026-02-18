const userModel = require("../Models/userModels");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json("All fields are required");

    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json("User with the given email already exists");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be valid");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be strong");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(200).json({
      _id: user._id,
      name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

module.exports = { registerUser };
