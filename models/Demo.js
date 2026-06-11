const mongoose=require("mongoose");

const demoSchema=new mongoose.Schema({

    fullname:String,

    email:String,

    size:String,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports=
mongoose.model(
    "DemoRequest",
    demoSchema
);