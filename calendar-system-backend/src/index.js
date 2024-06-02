import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { OAuth2Client, auth } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { google}  from 'googleapis';
import { dbConnection } from './config/db.js';

import {User , Event } from './user.model.js'



dotenv.config({});


const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your_jwt_secret';

const client = new OAuth2Client(process.env.CLIENT_ID , process.env.CLIENT_SECRET , 'http://localhost:3000');

const scopes = [
    'https://www.googleapis.com/auth/calendar'
]



function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY , (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
}



app.post('/auth/google' , async  (req , res) => {
    const { code } = req.body;

    const { tokens } = await client.getToken(code);

    const tokenResponse = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.CLIENT_ID,
      });

      const payload = tokenResponse.getPayload();
      const { sub : googleId , email , name , picture } = payload;

      let user = await User.findOne({ googleId });
      if (!user){
        user = new User({
            googleId , 
            email , 
            name ,
            picture , 
            accessToken : tokens.access_token ,
            refreshToken : tokens.refresh_token

        })
      }else{
        user.accessToken = tokens.access_token 
        user.refreshToken = tokens.refresh_token
      }

      await user.save();

      const userToken = jwt.sign({ googleId , userid : user._id } , SECRET_KEY)
      res.status(200).json({
        message : 'Login successful' ,
        token : userToken
      })
})

app.get('/events' , authenticateToken , async (req , res) => {
  const events = await Event.find({ userId : req.user.userid });
  console.log(events);
  res.send(events);
})

app.post('/create-event' , authenticateToken , async (req , res) => {

    console.log(req.body , req.user);

    const user = await User.findOne({ googleId : req.user.googleId });

    if(!user){
      return res.send(500);
    }

    const { title , description , participants , date , start , end , sessionNote } = req.body ;

    // // this token will coming from backend
    client.setCredentials({ refresh_token : user.refreshToken })

    const calendar = google.calendar('v3');
      const event = {
        summary: title , 
        description: description , 
        start: {
          dateTime: start
        },
        end: {
          dateTime: end
        },
      };

      const response = await calendar.events.insert({
        auth : client , 
        calendarId: 'primary',
        requestBody: event,
      });

      
      //  store into DB
      const newEvent = new Event({ 
        title , description , participants , date , start , end , sessionNote , userId :  user._id
      });

      await newEvent.save();

      res.status(200).json({ message: 'Event created successfully'});
})

app.patch('/update-event:id' , async (req , res) => {

  const eventId = req.params.id;

  const { title , description , participants , date , start , end  , sessionNote } = req.body;
  const updatedEvent = {
    summary: title , 
    description: description , 
    start: {
      dateTime: start
    },
    end: {
      dateTime: end
    },
  };

  const calendar = google.calendar('v3');
  await calendar.events.update({
    auth : client , 
    calendarId : 'primary' ,
    resource : updatedEvent 
  })

  await Event.findByIdAndUpdate(eventId , req.body );
  res.status(200).json({ message : 'Updated Successfully '})

})




const port = 8000;
app.listen(port , () => {
    dbConnection();
    console.log('port is listing..' , port)   
})
