import { google } from "googleapis";

import { Event, User } from "../db.model.js";
import { client } from "../config/oauth-config.js";
export async function deleteEvent(req , res){
    try {
      const user = await User.findOne({ googleId: req.user.googleId });
  
      if (!user) {
        return res.send(500);
      }
      
      const eventId = req.params.id;

      client.setCredentials({ refresh_token: user.refreshToken });
      
      // sync with google calendar
      const calendar = google.calendar("v3");
      let res = await calendar.events.delete({
        auth : client , 
        calendarId : "primary" ,
        eventId
      })
  
      // delete from db
      await Event.findOneAndDelete({ googleEventId : eventId });
  
      res.status(200).send({ message : 'deleted successfully !!'})
    }catch (err){
      res.status(500).send({ message: err.message });
    }
  }