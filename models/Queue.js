const mongoose=require('mongoose');

const queueSchema=new mongoose.Schema({
tokenNumber:{
        type:Number,
        required:true,
        unique:true
    },

    serviceType:{
        type:String,
        required:true
    },
servedAt:{
    type:Date,
    default:null
},startedAt:{
    type:Date,
    default:null
},
    customerName:{
        type:String,
        default:"Guest"
    },

    status:{
        type:String,
        enum:["waiting","serving","completed"],
        default:"waiting"
    },
counterId:{
    type:Number,
    default:null
},
},{
    timestamps:true
}
)

module.exports=mongoose.model("Queue",queueSchema);