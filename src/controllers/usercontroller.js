const userModel = require("../models/usermodel");

const userRegister = async function (req, res) {
  try {
    let data = req.userData;

    let newUser = await userModel.create(data);

    res.status(201).send({ status: true, data: newUser });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = { userRegister };
