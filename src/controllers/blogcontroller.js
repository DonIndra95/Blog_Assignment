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

    if (status == "Publish") data.publised_date = Date.now();

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

///////////------------LIST BLOG--------------------////////////////

const listBlog = async function (req, res, next) {
  try {
    let { title, dateFrom, dateTo, author, category } = req.query;

    let filter = { isDeleted: false };

    if (title?.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter a title" });

    if (title) {
      if (!isValid(title))
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid title" });

      filter.title = title.trim();
    }

    if (category?.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter a category" });

    if (category) {
      if (!isValid(category))
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid category" });

      filter.category = category.trim();
    }

    if (author?.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter a author" });

    if (author) {
      if (!isValidObjectId(author))
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid author" });

      filter.author = author.trim();
    }
    if (dateFrom?.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter a dateFrom" });

    if (dateFrom) {
      if (!isValid(dateFrom))
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid dateFrom" });
      var fromDate = new Date(dateFrom).getTime();

      filter.publised_date = { $gte: fromDate };
    }

    if (dateTo?.length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please enter a dateTo" });

    if (dateTo) {
      if (!isValid(dateTo))
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid dateTo" });
      var toDate = new Date(dateTo).getTime();

      filter.publised_date = { $lte: toDate };
    }

    if (dateTo && dateFrom)
      filter.publised_date = { $gte: fromDate, $lte: toDate };

    let allBlogs = await blogModel.find(filter).lean();
    if (allBlogs.length == 0)
      return res.status(404).send({ status: false, message: "No blogs found" });

    res.status(200).send({ status: true, data: allBlogs });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
///////////--------------------UPDATE BLOG---------------////////////////
const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;

    let checkUser = await blogModel.findOne({ _id: blogId, isDeleted: false });
    if (!checkUser)
      return res.status(404).send({ status: false, message: "No blogs found" });

    if (checkUser.author != req.token.userId)
      return res
        .status(403)
        .send({
          status: false,
          message: "User not authorized to access this data ",
        });

    let updateBlog = await blogModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      data,
      { new: true }
    );

    res.status(200).send({ status: true, data: updateBlog });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
///////////--------------------DELETE BLOG---------------////////////////
const deleteBlog=async function(req,res){
  try {
    let blogId = req.params.blogId;
  
    let checkUser = await blogModel.findOne({ _id: blogId, isDeleted: false });
    if (!checkUser)
      return res.status(404).send({ status: false, message: "No blogs found" });

    if (checkUser.author != req.token.userId)
      return res
        .status(403)
        .send({
          status: false,
          message: "User not authorized to access this data ",
        });

    await blogModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      {isDeleted:true},
      { new: true }
    );
    res.status(204).send({ status: true, message:"Blog Deleted"});
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}

module.exports = { createBlog, listBlog, updateBlog };
