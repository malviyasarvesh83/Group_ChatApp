const User = require("../models/user");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const Secret_Key = process.env.TOKEN_SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, Secret_Key);
    const response = await User.findByPk(user.userId);
    req.user = response;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Error while Authentication" });
  }
};

module.exports = { authenticate };