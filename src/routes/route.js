const express=require("express")
const { createBlog } = require("../controllers/blogcontroller")
const { userRegister, userLogin, getUser } = require("../controllers/usercontroller")
const { userValidation } = require("../validation/userValidations")
const router= express.Router()
/////----------USER APIs--------/////////
router.post("/userRegister",userValidation,userRegister)
router.post("/userLogin",userLogin)
router.get("/getUsers",getUser)

////----------BLOG APIs--------/////////
router.post("/blog",createBlog)




module.exports=router