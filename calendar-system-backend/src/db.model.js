import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: String,
  picture: String,
  accessToken: String,
  refreshToken: String,
});

export const User = mongoose.model('User', userSchema);


const eventSchema = new mongoose.Schema({
  title : String ,
  description : String  , 
  participants : [ { email : String } ], 
  date : Date ,
  start : Date ,
  end : Date , 
  sessionNote : String  , 
  userId : { type : Schema.Types.ObjectId , ref : 'User' },
  googleEventId : String 


})

export const Event = mongoose.model('Event' , eventSchema);