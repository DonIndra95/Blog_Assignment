const express=require("express")
const { userRegister } = require("../controllers/usercontroller")
const { userValidation } = require("../validation/userValidations")
const router= express.Router()

router.post("/userRegister",userValidation,userRegister)
router.post("/userLogin")
router.get("/getUsers")

module.exports=router