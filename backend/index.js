const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');
var thenrequest = require('then-request');
const jwt = require('express-jwt');
const jwtDecode = require('jwt-decode');
var moment = require('moment')
const rp = require("request-promise");
const bcrypt = require('bcryptjs');
const crypto = require("crypto")
const sendmail = require('sendmail')();
const path=require('path')
const {
  createToken,
  hashPassword,
  verifyPassword,
  createAgentToken,
  hashToken
} = require("./uitls");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'crmapp111@gmail.com',
    pass: 'bazooka911'
  }
});



const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname,'public/build')))
try {
    mongoose.connect("mongodb+srv://crmapp:bazooka911@cluster0.bwveu.mongodb.net/crm?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false}, () =>
    console.log("connected"));    
}catch (error) { 
    console.log("could not connect");    
}

const EventSchema = new mongoose.Schema({
    topic:String,
    description:String,
    meetingNumber:Number,
    date:Date,
    startTime:String,
    password:String,
    eventName:String
});

const Event = mongoose.model("Event" , EventSchema);

const agentSchema = new mongoose.Schema({
  name:String,
  id:String,
  phoneNo:String,
  email:String,
  position:String,
  role:String,
  password:String,
  isAgent:Boolean,
});

const Agent = mongoose.model("Agent",agentSchema);


const userSchema =new mongoose.Schema({

 id:Number,
 firstName:String,
 lastName:String,
 email:String,
 dateOfBirth:Date,
 gender:String,
 country:String,
 city:String,
 locality:String,
 address:String,
 password:String,
 nit:Number,
 companyName:String,
 contactName:String,
 phoneNo:Number,
 telephone:Number,
 events:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'Event'
 }]
})

const User = mongoose.model("User" , userSchema);

const yo = Date.now();
console.log(yo);
console.log(yo+2592000);

const passwordResetSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  resetPasswordToken: String,
  expiresAt:Number,
  createdAt:Number,
  status:Number
}) 

const PasswordReset = mongoose.model("PasswordReset",passwordResetSchema);

const attachUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authentication invalid' });
  }
  const decodedToken = jwtDecode(token.slice(7));

    console.log(decodedToken);
  if (!decodedToken) {
    return res.status(401).json({
      message: 'There was a problem authorizing the request'
    });
  } else {
    req.user = decodedToken;
    next();
  }
};

const requireSuperAgent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'There was a problem authorizing the request'
    });
  }
  if (req.user.role !== 'Super Agent') {
    return res
      .status(401)
      .json({ message: 'Insufficient role' });
  }
  next();
};

const checkJwt = jwt({
    secret:"omaewamoushinderu",
     algorithms: ['HS256']
}); 

const requireAgent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'There was a problem authorizing the request'
    });
  }
  if (req.user.isAgent != true) {
    return res
      .status(401)
      .json({ message: 'Insufficient role' });
  }
  next();
};

 app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname + 'public/index.html'));
 });

app.post('/resetpassword',async(req,res)=>{

  const email = req.body.email;
  
  const user =await User.findOne({email:email});
      if (!user) {
      
        return res.json({msg:'Email does not exist'})
      }

  const userId=user._id;
  const resetPassword = await PasswordReset.findOne({userId: user._id, status: 0})
  console.log("boga",resetPassword)
  if(resetPassword){
  
    const data=await PasswordReset.deleteOne({_id:resetPassword._id})
  }

  const token = crypto.randomBytes(32).toString('hex');
  const hash = await hashToken(token);
  
  console.log("hash",hash);

  const createdAt=Date.now()/1000;
  const expiresAt=createdAt + 43200;
  const passReset = new PasswordReset({
    userId:user._id,
    status:0,
    createdAt,
    expiresAt,
    resetPasswordToken:hash
  })

  const saved = await passReset.save();

  console.log("saved",saved);
  if(!saved){
    return res.status(500).json({msg:"Error occured"})
  }

  
  var mailOptions = {
  from: 'crmapp@gmail.com',
  to: user.email,
  subject: 'CRM App Reset Password',
  html: '<h4><b>Reset Password</b></h4>' +
                          '<p>To reset your password, complete this form. This link will expire in 12 hours.</p>' +
                          '<a href=' + " https://apple-cupcake-83038.herokuapp.com/" + 'reset/' + userId + '/' + token + '>'  + 'reset/' + userId + '/' + token + '</a>' +
                          '<br><br>' +
                          '<p>--Team</p>'
  };
  const mail=await transporter.sendMail(mailOptions);

  console.log("mail",mail);
  return res.status(200).json({msg:"Reset link sent",userId
,token})

})


app.post('/savenewpassword', async(req,res)=>{

  const userId = req.body.userId;
  const token = req.body.token;
  const password = req.body.password;

  console.log("body",req.body);
  try{
  const data = await PasswordReset.findOne({userId:userId, status:0});
  console.log("pr",data);
  if(!data){
    return res.status(403).json({msg:"Invalid credentials or expired link"})
  }
  const currentTime = Date.now()/1000;
  if(currentTime>data.expiresAt){
    return res.status(403).json({msg:"Invalid credentials or expired link"})
  }

  const valid = await verifyPassword(token,data.resetPasswordToken);
  if(valid){

    console.log("valid");
    const hash =await hashPassword(password);

    const data = await User.updateOne({_id:userId},{$set: {password:hash} });
    console.log(data);
    if(data){
      res.status(200).json({msg:"Password sucessfully updated!"})
    } 

  }
  }catch(err){
    console.log(err);
  }

})






app.post('/signup',async (req,res)=>{
  console.log(req.body);

  try{
    const newUser={

     id:req.body.id,
     firstName:req.body.firstName,
     lastName:req.body.lastName,
     email:req.body.email,
     dateOfBirth:req.body.dateOfBirth,
     gender:req.body.gender,
     country:req.body.country,
     city:req.body.city,
     locality:req.body.locality,
     address:req.body.address,
     nit:req.body.nit,
     companyName:req.body.companyName,
     contactName:req.body.contactName,
     phoneNo:req.body.phoneNo,
     telephone:req.body.telephone,
    };

    const hashedPassword = await hashPassword(
      req.body.password
    );

    newUser.password=hashedPassword;

    const existingEmail = await User.findOne({
      phoneNo: newUser.phoneNo
    }).lean();

    console.log("here");
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: 'Phone no already exists' });
    }
    console.log(newUser);
    const newUser1 = new User(newUser);
    const savedUser = await newUser1.save();

  console.log("here bithes");    
    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
     
      const {
        firstName,
        lastName,
        email,
        phoneNo,
        nit,
        id,
        companyName,
        contactName,
        _id,
        events
      } = savedUser;



      const userInfo = {
       
      name:`${firstName} ${lastName}`,
       email,
       phoneNo,
       nit,
       id,
       companyName,
       contactName,
       _id,
       events,
       isAgent:false
      }

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account'
      });
    }

    }catch(err){
     return res.status(400).json({
      message: 'There was a problem creating your account'
    });
    }


});



app.post('/login/agent', async (req, res) => {
  console.log(req.body);
  try {
    const { phoneNo, password } = req.body;
    console.log(phoneNo);
    const user = await Agent.findOne({
      phoneNo
    }).lean();

    if (!user) {
      return res.status(403).json({
        message: 'Wrong phone or password.'
      });
    }

    const passwordValid = await verifyPassword(
      password,
      user.password
    );

    console.log("user")
    if (passwordValid) {
      const {
        name,
        email,
        phoneNo,
        id,
        role,
        position,
        _id
      }=user;

      const userInfo = {
        name,
        email,
        phoneNo,
        id,
        role,
        position,
        _id,
        isAgent:true
      };
      const token = createAgentToken(user);

      const decodedToken = jwtDecode(token);
      console.log("Decoded",decodedToken);

      const expiresAt = decodedToken.exp;
      
      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong email or password.'
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: 'Something went wrong.' });
  }
});



app.post('/login', async (req, res) => {
  try {
    const { phoneNo, password } = req.body;

    const user = await User.findOne({
      phoneNo
    }).lean();

    if (!user) {
      return res.status(403).json({
        message: 'Wrong email or password.'
      });
    }

    const passwordValid = await verifyPassword(
      password,
      user.password
    );

    console.log("user")
    if (passwordValid) {
      const {
        firstName,
        lastName,
        email,
        phoneNo,
        nit,
        id,
        companyName,
        contactName,
        _id,
        events
      }=user;

      const userInfo = {
       
      name:`${firstName} ${lastName}`,
       email,
       phoneNo,
       nit,
       id,
       companyName,
       contactName,
       _id,
       events,
       isAgent:false
      };
      const token = createToken(user);

      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      
      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong email or password.'
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: 'Something went wrong.' });
  }
});


app.get("/events",async(req,res)=>{
  try{
  
    const data = await Event.find().limit(20); 

    console.log(data);

    res.send(data);
  }catch(err){
    res.status(500).json({error:"An error occured"});
  }



})

app.get('/events/:pageNumber',async(req,res)=>{

    try{
    const page= req.params.pageNumber;
    console.log(page);
    const data = await Event.find().skip((page-1)*10).limit(10);
    console.log(data);
    res.send(data);
    }catch(err){
      res.status(500).json({msg:"Error"});
    }


})

app.use(attachUser);

app.get('/agents',checkJwt,requireSuperAgent,async(req,res)=>{

  const data= await Agent.find().limit(100);
  
  res.send(data);
});

app.patch('/agents',checkJwt,requireSuperAgent,(req,res)=>{

  Agent.updateOne({_id:req.body.id}, {$set: req.body }, (err)=>{
        if(!err){
            return res.send("Successfully Updated");
        }
        else
        return res.status(500);
        
    });

})

app.post('/agents/delete',checkJwt,requireSuperAgent,async(req,res)=>{
  
  console.log("body",req.body)
  try{
    const data =await Agent.deleteOne({_id:req.body.id})
    if(data){
      console.log(data)
       res.status(200).json({msg:"bitch",data,yo});
    }

  }catch(err){
    
    console.log(err);
    res.status(500).json({err:"message"});
  }


})

app.patch('/clients',checkJwt,(req,res)=>{

    User.updateOne({_id:req.body.id}, {$set: req.body }, (err)=>{
        if(!err){
            
            const data= User.findOne({_id:req.body.id})
            return res.status(200).json({msg:"Successfully Updated"},data);

        }
        else
        return res.status(500);
        
    });


})



app.get("/clients",checkJwt,requireAgent,async (req,res)=>{

  try{
    const data=await User.find().limit(20);
    res.send(data);
  }catch(err){
    console.log(err);
    res.json({err:"message"});
  }
})

app.post("/clients/delete",checkJwt,requireSuperAgent,async (req,res)=>{
  let id=req.body.id;
  const yo=req.body;
  console.log(id);
  try{
    const data=await User.deleteOne({_id:id})
    console.log(data);
    res.status(200).json({msg:"bitch",data,yo});
  }catch(err){
    console.log(err);
    res.json({err:"message"});
  }
})

app.post("/events/delete",checkJwt,requireAgent,async (req,res)=>{
  let id=req.body.id;
  const yo=req.body;
  console.log(id);
  try{
    const data=await Event.deleteOne({_id:id})
    console.log(data);
    res.status(200).json({msg:"deleted bitch",data,yo});
  }catch(err){
    console.log(err);
    res.json({err:"message"});
  }
})


app.patch("/events",checkJwt,requireAgent,(req, res)=>{

    Event.updateOne({_id:req.body.id}, {$set: req.body }, (err)=>{
        if(!err){
            return res.send("Successfully Updated");
        }
        else
        return res.status(500);
        
    });

})

app.post("/events",checkJwt,requireAgent,async (req,res)=>{

  const event= new Event({
    topic:req.body.topic,
    description:req.body.description,
    meetingNumber:req.body.meetingNumber,
    date:req.body.date,
    startTime:req.body.startTime,
    password:req.body.password,
    eventName:req.body.eventName
  })
  try{
  const data = await event.save();
  if(data){

    return res.status(201).json({msg:"event created!"})
  }
  }
  catch(err){
    res.status(500).json("msg:Cannot create event")

  }

})



const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Il9wU051N1BLU0tPSFVMWmJWc2VObGciLCJleHAiOjE2NDgzODgyMjAsImlhdCI6MTYxNjg0NjY1NH0.LjoHAL1Qg3dbmgGr8STlSi769OyYGTxx5kpzdWafG9c";
app.get("/newmeeting", (req, res) => {
  email = "moh.safdar2000@gmail.com";
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "test meeting",
      type: 1,
      agenda:"testing sdk",
      settings: {
        host_video: "true",
        participant_video: "true"
      }
    },
    auth: {
      bearer: token
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json"
    },
    json: true //Parse the JSON string in the response
  };

  rp(options)
    .then(async (response)=> {
      console.log("response is: ", response);
      const newEvent = {
        uuid:response.uuid,
        id:response.id,
        host_id:response.host_id,
        host_email:response.host_email,
        topic:response.topic,
        type:response.type,
        status:response.status,
        timezone:response.timezone,
        created_at:response.date,
        start_url:response.start_url,
        join_url:response.join_url,
        password:response.password
      }
      const newEvent1 = new Event(newEvent);
      const savedEvent = await newEvent1.save();

      console.log(savedEvent);
      res.status(200).json({msg:"meeting created"});
    })
    .catch(function(err) {
      // API call failed...
      console.log(err);
      res.status(500).json({msg:"erro"});
    });
});


app.post("/user/events",checkJwt,async(req,res)=>{
  const id= req.body.user_id;
  console.log(req.body);
  try{
  const user = await User.findById(id).populate('events');
  
    res.status(200).send(user.events);
  }
  catch(err){
  console.log(err);
  res.status(400).json({msg:"error bitch"});
}
})


app.get('/createUser', function(req, res) {
  
  var options = {
    qs: {api_key: '_pSNu7PKSKOHULZbVseNlg', api_secret: 'KVVgdEyihGN2CGGRqSzg3yrccaGDZEE0kAbw', data_type: "JSON", email: 'khizaramjad50@gmail.com' , type: 2}
  };

  // make an asynchronous request to zoom to create a User
  var asyncres = thenrequest('POST',"https://dev.zoom.us/v1/user/create",options).done(function (res) {
    console.log(res.getBody('utf8'));
    });
  res.send('dssdasdas');
});

app.post("/subscribe",checkJwt,async(req,res)=>{

  user_id=req.body.user_id;
  meeting_id=req.body.meeting_id;

  console.log(user_id);
  console.log(meeting_id);
  try{
  const user = await User.findById(user_id);
  console.log(user);
  user.events.push(meeting_id);
  const yo=await user.save();
    res.status(200).json({msg:"subscribed"});
  }
 catch(err){
   console.log(err);
  res.status(500).json({msg:"error bitch"});
 }
})

app.post('/addagent',checkJwt,requireSuperAgent,async (req,res)=>{
  console.log(req.body);

  try{
    const newAgent={
      name:req.body.name,
      id:req.body.id,
      phoneNo:req.body.phoneNo,
      email:req.body.email,
      position:req.body.position,
      role:req.body.role,
      isAgent:true
    };

  
    console.log("pass",req.body.password)
    const hashedPassword = await hashPassword(
      req.body.password
    );

    newAgent.password=hashedPassword;

    const existingEmail = await Agent.findOne({
      phoneNo: newAgent.phoneNo
    }).lean();

    console.log("here");
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: 'Phone no already exists' });
    }
    console.log(newAgent);
    const newAgent1= new Agent(newAgent);
    const savedUser = await newAgent1.save();

  console.log("here bithes");    
    if (savedUser) {
      const token = createAgentToken(savedUser);
      const decodedToken = jwtDecode(token);
      console.log("Decoded",decodedToken);
      const expiresAt = decodedToken.exp;
     
      const {
        name,
        email,
        phoneNo,
        id,
        role,
        position,
        _id
      } = savedUser;



      const userInfo = {
        name,
        email,
        phoneNo,
        id,
        role,
        position,
       _id,
       isAgent:true
      }

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account'
      });
    }

    }catch(err){
      console.log(err);
    return res.status(400).json({
      message: 'There was a problem creating your account'
    });
    }


});


app.get('/clients/:pageNumber',checkJwt,requireAgent,async(req,res)=>{

    try{
    const page= req.params.pageNumber;
    console.log(page);
    const data = await User.find().skip((page-1)*10).limit(10);
    console.log(data);
    res.send(data);
    }catch(err){
      res.status(500).json({msg:"Error"});
    }


})


app.get('/agents/:pageNumber',checkJwt,requireSuperAgent,async(req,res)=>{

    try{
    const page= req.params.pageNumber;
    console.log(page);
    const data = await Agent.find().skip((page-1)*10).limit(10);
    console.log(data);
    res.send(data);
    }catch(err){
      res.status(500).json({msg:"Error"});
    }


})
// app.get('/test',attachUser,(req,res)=>{

//   res.json(req.user);
// })

// const options = {
//   method: 'POST',
//   url: 'https://api.zoom.us/v2/users',
//   body: {
//    "action": "create",
//    "user_info": {
//      "email": "khizaramjad50@gmail.com",
//      "type": 1,
//      "first_name": "James",
//      "last_name": "Bond"
//    }
// },
// auth: {
//       bearer: token
//     },
//     headers: {
//       "User-Agent": "Zoom-api-Jwt-Request",
//       "content-type": "application/json"
//     },
//   json: true
// };
// rp(options).then( function (error, response, body) {
//   if (error) throw new Error(error);
//   console.log(body);
// })



    
let port = process.env.PORT;
if (port == null || port == "") {
port = 3001;
}
app.listen(port, function() {
console.log("Server started!");
});

