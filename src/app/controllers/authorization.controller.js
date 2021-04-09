const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

const UserSchema = require("../models/user");

function generateToken(params = {}) {
  return jwt.sign({ params }, authConfig.secret);
}

async function login(req, res) {
  try {
    const { login, password } = req.body;

    var user = await UserSchema.findOne({ login })
      .select("password")
      .select("name")
      .lean();

    if (!user)
      return res.status(400).send({ error: "Incorret user or password" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: "Incorret user or password" });

    user.password = undefined;

    res.send({
      user,
      token: generateToken({
        id: user._id,
      }),
    });
  } catch (err) {
    return res.status(400).send({ error: "Error on login" });
  }
}

module.exports = { login };
