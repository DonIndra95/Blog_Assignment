const userModel = require("../models/usermodel");
const validator = require("validator");
const bcrypt = require("bcrypt");

const isValid = function (value) {
  if (typeof value == undefined || value == null) return false;
  if (typeof value == "string" && value.trim().length == 0) return false;
  if (typeof value == "string") return true;
};

const userValidation = async function (req, res, next) {
  try {
    if(Object.keys(req.body).length==0)
    return res
    .status(400)
    .send({ status: false, message: "Please enter valid input in body" });

    let { firstName, lastName, email, password, DOB, role } = req.body;

    let data = {};

    if (!isValid(firstName))
      return res
        .status(400)
        .send({ status: false, message: "Please enter firstName" });

    data.firstName = firstName;

    if (!isValid(lastName))
      return res
        .status(400)
        .send({ status: false, message: "Please enter lastName" });

    data.lastName = lastName;

    if (!isValid(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid email" });
    data.email = email;

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });
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

    let cryptedPassword = await bcrypt.hash(password, 5);

    data.password = cryptedPassword;

    if (!isValid(DOB))
      return res
        .status(400)
        .send({ status: false, message: "Please enter DOB" });
    data.DOB = DOB;

    if (!isValid(role))
      return res
        .status(400)
        .send({ status: false, message: "Please enter role" });

    if (!["Admin", "User"].includes(role))
      return res
        .status(400)
        .send({ status: false, message: "Roles can only be Admin or User" });
    data.role = role;

    let checkEmail=await userModel.findOne({email:email})
    if(checkEmail)
    return res
        .status(409)
        .send({ status: false, message: `${email} already registered` });


    req.userData = data;

    next()

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { isValid, userValidation };
