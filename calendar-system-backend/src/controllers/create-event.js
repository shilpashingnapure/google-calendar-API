
import { google } from "googleapis";

import { Event, User } from "../db.model.js";
import { client } from "../config/oauth-config.js";

export async function createEvent(req, res){
    try {
      const user = await User.findOne({ googleId: req.user.googleId });
  
      if (!user) {
        return res.send(500);
      }
  
      const { title, description, participants, date, start, end , sessionNote } = req.body;
  
      // this token will coming from backend
      client.setCredentials({ refresh_token: user.refreshToken });
      
      // sync with google calendar
      const calendar = google.calendar("v3");
      const event = {
        summary: title,
        description: description,
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        },
        attendess: participants,
      };
      const response = await calendar.events.insert({
        auth: client,
        calendarId: "primary",
        requestBody: event,
      });
  
      if (response.status == 200) {
        const googleEventId = response.data.id
        //  event store into DB
        const newEvent = new Event({
          title,
          description,
          participants,
          date,
          start,
          end,
          sessionNote,
          userId: user._id,
          googleEventId 
        });
  
        await newEvent.save();
  
        res.status(201).json({ message: "Event created successfully" });
      } else {
        res
          .status(500)
          .send({ message: "Error occur in integrating in google calendar !!" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }