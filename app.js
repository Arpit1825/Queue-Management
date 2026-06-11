require('dotenv').config();
const express=require('express');
const app=express();
const db=require("./config/mongoose-connection");
const path=require('path');
const ejs=require('ejs');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const User = require("./models/user");
const Message=require("./models/Message");
const DemoRequest=require('./models/Demo')
const JWT_SECRET = process.env.JWT_SECRET;
const queueRoutes =require("./routes/queue");
const contactRoutes=require("./routes/contact");
console.log(db);

app.use(express.json());
app.use('/contact',contactRoutes);
app.use('/queue',queueRoutes);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")))


app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})




app.post("/signup",async(req,res)=>{

    let {fullname,email,password}=req.body;

    let user=await User.findOne({email});

    if(user){
        return res.send("User already exists");
    }

    let hash=await bcrypt.hash(password,10);

    user=await User.create({
        fullname,
        email,
        password:hash
    });

    let token=jwt.sign(
        {email:user.email,id:user._id},JWT_SECRET);

    res.cookie("token",token);

    res.redirect("/dashboard");
});

app.post("/login",async(req,res)=>{

    let {email,password}=req.body;

    let user=await User.findOne({email});

    if(!user){
        return res.send("User not found");
    }

    let result=await bcrypt.compare(
        password,
        user.password
    );

    if(!result){
        return res.send("Wrong Password");
    }

    let token=jwt.sign(
        {email:user.email,id:user._id},
        JWT_SECRET
    );

    res.cookie("token",token);

    res.redirect("/dashboard");
});
app.get("/demo",(req,res)=>{
    res.render("demo");
});

app.post("/demo",async(req,res)=>{

    await DemoRequest.create(req.body);
    console.log(req.body);

    res.json({
        success:true,
        message:"Demo request submitted successfully"
    });
});

function isLoggedIn(req,res,next){

    const token=req.cookies.token;

    if(!token){
        return res.redirect("/login");
    }

    try{

        const data=jwt.verify(
            token,
            JWT_SECRET
        );

        req.user=data;

        next();

    }catch(err){

        return res.redirect("/login");

    }

}

app.get("/dashboard",isLoggedIn,async(req,res)=>{

    const user = await User.findById(req.user.id);

    res.render("dashboard",{
        user
    });

});
app.post("/contact",(req,res)=>{
    console.log("CONTACT HIT");
    console.log(req.body);

    res.send("working");
});


app.get("/logout",(req,res)=>{
    res.cookie("token","");
    
    res.redirect("/");
});

app.listen(3000,(req,res)=>{
    console.log("Running");
    
})

