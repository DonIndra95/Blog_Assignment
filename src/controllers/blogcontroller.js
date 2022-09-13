const { isValidObjectId } = require("mongoose");
const blogModel = require("../models/blogmodel");
const { isValid } = require("../validation/userValidations");

/////////////////////////----------------CREATE BLOG--------------------//////////////////

const createBlog = async function (req, res) {
  try {
    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid input in body" });

    let { title, description, status, category, start_date, end_date } =
      req.body;

    let data = {
      author: req.params.userId,
    };

    if (!isValid(title))
      return res
        .status(400)
        .send({ status: false, message: "Please enter title" });
    data.title = title.trim();

    if (!isValid(description))
      return res
        .status(400)
        .send({ status: false, message: "Please enter description" });
    data.description = description.trim();

    if (!isValid(status))
      return res
        .status(400)
        .send({ status: false, message: "Please enter status" });

    if (!["Publish", "Unpublish"].includes(status))
      return res.status(400).send({
        status: false,
        message: "Status can only be Publish or Unpublish",
      });

    data.status = status;

    if (status == "Publish") data.publised_date = new Date().toISOString();

    if (!isValid(category))
      return res
        .status(400)
        .send({ status: false, message: "Please enter category" });

    data.category = category.trim();

    if (!isValid(start_date))
      return res
        .status(400)
        .send({ status: false, message: "Please enter start_date" });

    data.start_date = start_date.trim();

    if (!isValid(end_date))
      return res
        .status(400)
        .send({ status: false, message: "Please enter end_date" });
    data.end_date = end_date.trim();

    let newBlog = await blogModel.create(data);
    res.status(201).send({ status: true, data: newBlog });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createBlog };
