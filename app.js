require('dotenv').config();

const express = require('express');
const app = express();

const http = require("http");
const { Server } = require("socket.io");
const { Resend } = require("resend");

const resend = new Resend(
    process.env.RESEND_API_KEY
);
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

app.set("io",io);

io.on("connection",(socket)=>{

    console.log("User Connected");

    socket.on("disconnect",()=>{

        console.log("User Disconnected");

    });

});

const db = require("./config/mongoose-connection");
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const User = require("./models/user");
const Message = require("./models/Message");
const DemoRequest = require('./models/Demo');
const PORT=process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const Queue = require("./models/Queue");
const queueRoutes = require("./routes/queue");
const contactRoutes = require("./routes/contact");

console.log(db);

app.use(express.json());

app.use('/contact',contactRoutes);
app.use('/queue',queueRoutes)

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(cookieParser());

app.use(express.urlencoded({
    extended:true
}));

app.use(express.static(
    path.join(__dirname,"public")
));

app.get('/',(req,res)=>{
    res.render('index');
});

app.post("/demo",async(req,res)=>{

    await DemoRequest.create(req.body);

    await resend.emails.send({

        from:"onboarding@resend.dev",

        to:process.env.ADMIN_EMAIL,

        subject:"New Demo Request",

        html:`
            <h2>New Demo Request</h2>

            <p><b>Name:</b> ${req.body.fullname}</p>

            <p><b>Email:</b> ${req.body.email}</p>

            <p><b>Branch Size:</b> ${req.body.size}</p>
        `
    });

    await resend.emails.send({

        from:"onboarding@resend.dev",

        to:req.body.email,

        subject:"Demo Request Received",

        html:`
            <h2>Thank you for your interest in SmartQueue</h2>

            <p>
                We have received your demo request.
            </p>

            <p>
                Our team will contact you shortly.
            </p>
        `
    });

    res.json({
        success:true,
        message:"Demo request submitted successfully"
    });

});

app.get('/login',(req,res)=>{
     res.render('login',{
        error:null
    });
});

app.get("/profile",isLoggedIn,async(req,res)=>{

    const user =
    await User.findById(
        req.user.id
    );
const totalCompleted =
await Queue.countDocuments({
    status:"completed"
});
const totalTokens =
await Queue.countDocuments();

const totalWaiting =
await Queue.countDocuments({
    status:"waiting"
});

const totalServing =
await Queue.countDocuments({
    status:"serving"
});

res.render("profile",{
    user,
    totalCompleted,
    totalWaiting,
    totalServing,
    totalTokens
});

});
app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.get("/analytics",(req,res)=>{
    res.render("analytics");
});

app.get(
    "/queue-management",
    isLoggedIn,
    (req,res)=>{

        res.render("queue");

    }
);

app.post("/signup",async(req,res)=>{

    let {
        fullname,
        email,
        password
    } = req.body;

    let user =
    await User.findOne({
        email
    });

    if(user){

        return res.send(
            "User already exists"
        );

    }

    let hash =
    await bcrypt.hash(
        password,
        10
    );

    user =
    await User.create({
        fullname,
        email,
        password:hash
    });

    let token =
    jwt.sign(
        {
            email:user.email,
            id:user._id
        },
        JWT_SECRET
    );

    res.cookie(
        "token",
        token
    );

    res.redirect(
        "/dashboard"
    );

});

app.post("/login",async(req,res)=>{

    let {
        email,
        password
    } = req.body;

    let user =
    await User.findOne({
        email
    });

    if(!user){

        return res.send(
            "User not found"
        );

    }

    let result =
    await bcrypt.compare(
        password,
        user.password
    );


       if(!result){

    return res.render("login",{
        error:"Incorrect Password"
    });

}

    

    let token =
    jwt.sign(
        {
            email:user.email,
            id:user._id
        },
        JWT_SECRET
    );

    res.cookie(
        "token",
        token
    );

    res.redirect(
        "/dashboard"
    );

});

app.get("/demo",(req,res)=>{
    res.render("demo");
});

app.post("/demo",async(req,res)=>{

    await DemoRequest.create(
        req.body
    );

    console.log(req.body);

    res.json({
        success:true,
        message:
        "Demo request submitted successfully"
    });

});

function isLoggedIn(
    req,
    res,
    next
){

    const token =
    req.cookies.token;

    if(!token){

        return res.redirect(
            "/login"
        );

    }

    try{

        const data =
        jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = data;

        next();

    }
    catch(err){

        return res.redirect(
            "/login"
        );

    }

}

app.get(
    "/dashboard",
    isLoggedIn,
    async(req,res)=>{

        const user =
        await User.findById(
            req.user.id
        );

        res.render(
            "dashboard",
            {
                user
            }
        );

    }
);

app.post("/contact",(req,res)=>{

    console.log(
        "CONTACT HIT"
    );

    console.log(
        req.body
    );

    res.send("working");

});

app.get("/logout",(req,res)=>{

    res.cookie(
        "token",
        ""
    );

    res.redirect("/");

});

server.listen(PORT,()=>{

    console.log(
        "Running on Port 3000"
    );

});