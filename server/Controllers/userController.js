const userModel = require("../Models/userModels");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

//*Register user api
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Email must be valid" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: "Password must be strong" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//*Login user api
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = createToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

//*Find user api
const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

//*get user api
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
module.exports = { registerUser, loginUser, findUser, getUsers };
