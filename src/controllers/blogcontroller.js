const blogModel = require("../models/blogmodel");

/////////////////////////----------------CREATE BLOG--------------------//////////////////

const createBlog = async function (req, res) {
  try {

    
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports={createBlog}
