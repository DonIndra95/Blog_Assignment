const userModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
///////////-------------------------------------USER REGISTER-----------------/////////////////
const userRegister = async function (req, res) {
  try {
    let data = req.userData;

    let newUser = await userModel.create(data);

    res.status(201).send({ status: true, data: newUser });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
///////////-------------------------------------USER LIST-----------------/////////////////
const getUser = async function (req, res) {
  let findUsers = await userModel
    .find()
    .select({ _id: 0, firstName: 1, lastName: 1, email: 1, DOB: 1, role: 1 });

  res.status(200).send({ status: true, data: findUsers });
};
///////////-------------------------------------USER LOGIN-----------------/////////////////
const userLogin = async function (req, res) {
  try {
    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid input in body" });

    let { email, password } = req.body;

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });

    if (
      !validator.isStrongPassword(password, {
        minLength: 5,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
        minLowerCase: 1,
      })
    )
      return res.status(400).send({
        status: false,
        message:
          "Please enter a password having minimum length 5 with atleast 1 uppercase,1 number,1 special character",
      });

    let checkEmail = await userModel.findOne({ email: email });

    if (!checkEmail)
      return res
        .status(404)
        .send({ status: false, message: `'${email}' not found` });

    let checkPassword = bcrypt.compareSync(password, checkEmail.password);

    if (!checkPassword)
      return res.status(401).send({ status: false, message: "Wrong password" });

    const token = jwt.sign(
      {
        userId: checkEmail._id,
        role: checkEmail.role,
      },
      "secret-key-2022",
      { expiresIn: "24h" }
    );

    res.setHeader("authorization", token);

    res.status(200).send({ status: true, data: token });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = { userRegister, userLogin, getUser };
