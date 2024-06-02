import { google } from "googleapis";

import { Event, User } from "../db.model.js";
import { client } from "../config/oauth-config.js";

export async function updateEvent(req, res){
    try {
      
      const user = await User.findOne({ googleId: req.user.googleId });
  
      if (!user) {
        return res.send(500);
      }
  
      const eventId = req.params.id;
  
      const { title, description, participants, date, start, end, sessionNote } = req.body;
      const updatedEvent = {
        summary: title,
        description: description,
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        },
      };
  
      client.setCredentials({ refresh_token: user.refreshToken });
      
      // sync with google calendar
      const calendar = google.calendar("v3");
      const response = await calendar.events.patch({
        auth: client,
        calendarId: "primary",
        resource: updatedEvent,
        eventId
      });
      
      // update into DB
      await Event.findOneAndUpdate({ googleEventId : eventId }, req.body);
      res.status(200).send({ message: "Updated Successfully " });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }