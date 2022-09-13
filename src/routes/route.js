const express=require("express")
const { userRegister, userLogin, getUser } = require("../controllers/usercontroller")
const { userValidation } = require("../validation/userValidations")
const router= express.Router()

router.post("/userRegister",userValidation,userRegister)
router.post("/userLogin",userLogin)
router.get("/getUsers",getUser)

module.exports=router