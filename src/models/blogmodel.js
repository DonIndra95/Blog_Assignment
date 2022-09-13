const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: objectId,
      ref: "Users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    publised_date: {
      type: String,
      required: true,
    },
    modify_date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Publish", "Unpublish"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    recurrence: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);  

module.exports=mongoose.model("Blog",blogSchema)
