const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        reuired:true
    },
    password:{
        type:String,
        reuired:true
    },
    DOB:{
        type:String,
        reuired:true
    },
    role:{
        type:String,
        enum:["Admin","User"],
        reuired:true
    }
},{timestamps:true})

module.exports=mongoose.model("User",UserSchema)