import { Event } from "../user.model.js";
export async function getAllEvents(req, res) {
  try {
    const events = await Event.find({ userId: req.user.userid });
    res.status(200).send(events);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}
