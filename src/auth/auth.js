const userModel = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");

const authentication = function (req, res, next) {
  try {
    let bearerToken = req.headers["authorization"];
    let token = null;

    if (typeof bearerToken !== undefined) {
      let bearer = bearerToken.split(" ");
      token = bearer[1];
    }
    if (!token)
      return res
        .status(401)
        .send({ status: false, message: "Token missing,not logged in" });

    jwt.verify(token, "secret-key-2022", function (err, decoded) {
      if (err)
        return res.status(401).send({ status: false, message: err.message });
      else {
        req.token = decoded;
        next();
      }
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const authorization = async function (req, res, next) {
  try {
    let userId = req.params.userId;
    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid UserId in params " });

    let user=await userModel.findById(userId).lean()

    if(!user)
    return res.status(404).send({ status: false, message: "User not found" });

    if(userId!=req.token.userId&&user.role=="User")
    return res.status(403).send({ status: false, message: "User is not authorized to access this data" });

    next()

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { authentication, authorization };
