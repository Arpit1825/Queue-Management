const express=require('express');
const router=express.Router();
const Queue=require('../models/Queue');
const mongoose=require('mongoose');
const config=require('../config/mongoose-connection')


router.post("/create", async(req,res)=>{

    console.log("CREATE ROUTE HIT");

    const { serviceType, customerName } = req.body;

    const lastToken = await Queue
        .findOne()
        .sort({ tokenNumber:-1 });

    const nextToken =
        lastToken ?
        lastToken.tokenNumber + 1 :
        100;

    const token = await Queue.create({

        tokenNumber: nextToken,

        serviceType,

        customerName,

        status:"waiting"

    });

    console.log("SAVED TOKEN:", token);

    res.json(token);

});

router.get("/", async(req,res)=>{

    const queue = await Queue.find({
        status:"waiting"
    }).sort({ tokenNumber:1 });

    res.json(queue);

});

router.post("/serve", async(req,res)=>{

    const busyCounters = await Queue.find({
        status:"serving"
    }).distinct("counterId");

    let freeCounter = null;

    for(let i=1;i<=4;i++){

        if(!busyCounters.includes(i)){
            freeCounter = i;
            break;
        }

    }

    if(!freeCounter){

        return res.status(400).json({
            message:"All counters are busy"
        });

    }

    const nextCustomer = await Queue.findOne({
        status:"waiting"
    }).sort({ tokenNumber:1 });

    if(!nextCustomer){

        return res.status(400).json({
            message:"No customers waiting"
        });

    }

    nextCustomer.status = "serving";
    nextCustomer.counterId = freeCounter;

    await nextCustomer.save();

    res.json(nextCustomer);

});


router.post("/complete/:counterId", async(req,res)=>{

    const counterId = req.params.counterId;

      const customer = await Queue.findOne({
        status:"serving"
    }).sort({ tokenNumber: 1 });

    if(!customer){

        return res.json({
            message:"No active service"
        });

    }

    customer.status = "completed";

    await customer.save();

    res.json(customer);

    const nextCustomer = await Queue.findOne({
    status:"waiting"
}).sort({ tokenNumber:1 });

if(nextCustomer){

    nextCustomer.status = "serving";
    nextCustomer.counterId = customer.counterId;

    await nextCustomer.save();
}
});

router.get("/dashboard", async(req,res)=>{

    const waiting = await Queue.find({
        status:"waiting"
    }).sort({tokenNumber:1});

    const serving = await Queue.find({
        status:"serving"
    });

    const completed = await Queue.find({
        status:"completed"
    }).sort({updatedAt:-1}).limit(10);

    res.json({
        waiting,
        serving,
        completed
    });

});

router.post("/reset", async(req,res)=>{

    await Queue.deleteMany({
        status:{
            $in:["waiting","serving"]
        }
    });

    res.json({
        message:"Queue reset successfully"
    });

});

router.get("/analytics", async(req,res)=>{

    const totalCompleted = await Queue.countDocuments({
        status:"completed"
    });

    const totalWaiting = await Queue.countDocuments({
        status:"waiting"
    });

    const totalServing = await Queue.countDocuments({
        status:"serving"
    });

    const serviceStats = await Queue.aggregate([
        {
            $group:{
                _id:"$serviceType",
                count:{ $sum:1 }
            }
        }
    ]);

    res.json({
        totalCompleted,
        totalWaiting,
        totalServing,
        serviceStats
    });

});

module.exports=router;