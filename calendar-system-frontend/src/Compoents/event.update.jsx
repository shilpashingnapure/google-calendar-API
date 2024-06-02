import FaceIcon from "@mui/icons-material/Face";
import { Button, Chip, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment/moment";
import { updateMethod } from "../utilites/rest.methods";

export const ScheduleUpdateForm = ({ open, onClose, data }) => {
  const [participant, setParticipant] = useState();
  const [participantsList, setListParticipants] = useState();

  const [event, setEvent] = useState();

  // when data is getting
  useEffect(() => {
    //convert into date
    let start = moment(data.event.start);
    let end = moment(data.event.end);

    // find duration of start end end time
    let duration = moment.duration(end.diff(start)).asHours();
    setListParticipants(data.event.extendedProps.participants);

    // because data is comming in different form , so for simplcity and for update used this
    setEvent({
      title: data.event.title,
      description: data.event.extendedProps.description,
      start,
      end,
      duration,
      sessionNote: data.event.extendedProps.sessionNote,
      googleEventId: data.event.extendedProps.googleEventId,
    });
  }, [data]);

  // handle the updated key into event object state
  function handleInput(key, value) {
    if (key === "start") {
      setEvent({ ...event, [key]: moment(value) });
    } else {
      setEvent({ ...event, [key]: value });
    }
  }

  // update event thorught api call
  async function handleEvent() {
    // convert this into end time
    const endDateTime = event.start.clone().add(event.duration, "hours");

    const updateEvent = {
      title: event.title,
      description: event.description,
      participants: participantsList,
      start: event.start.toISOString(),
      end: endDateTime.toISOString(),
      sessionNote: event.sessionNote,
    };

    await updateMethod(`/update-event/${event.googleEventId}`, updateEvent);
    resetState();
  }

  function addparticipants() {
    setListParticipants([...participantsList, { email: participant }]);
    setParticipant(() => "");
  }

  function removeParticipant(index) {
    let participants = participantsList;
    participants.splice(index, 1);
    setListParticipants([...participants]);
  }

  function resetState() {
    setListParticipants([]);
    setParticipant("");
    onClose();
  }

  if (!event) {
    return;
  }
  return (
    <div className="basis-[40%] w-[40%] border-2 bg-blue-200 py-5 px-4 rounded-lg flex gap-4 flex-col">
      <h1 className="text-lg">Update Scheduled Meet</h1>
      <div className="text-start">
        <form className="flex flex-col px-8 gap-4">
          {/* date  */}
          <div className="text-md">
            <b>{moment(data.event.start).format("dddd, MMM D")}</b>
          </div>
          {/* title */}
          <TextField
            label="event title"
            name="title"
            value={event.title}
            onChange={(e) => handleInput("title", e.target.value)}
          />
          {/* description */}
          <TextField
            label="Description"
            name="description"
            value={event.description}
            onChange={(e) => handleInput("description", e.target.value)}
          />

          {/* participents */}
          <div className="flex items-center gap-3">
            <TextField
              label="list of participants"
              className="flex-1"
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
            />
            <Button
              type="button"
              onClick={addparticipants}
              className="px-5 bg-blue-500"
              variant="contained"
            >
              Add
            </Button>
          </div>

          {/* list of participants */}
          <div className="flex gap-3  flex-wrap items-center">
            {participantsList.map((item, index) => {
              if (index < 2) {
                return (
                  <Tooltip title={item.email}>
                    <Chip
                      icon={<FaceIcon />}
                      sx={{ width: "30%" }}
                      label={item.email}
                      onDelete={() => removeParticipant(index)}
                    />
                  </Tooltip>
                );
              }
              return -1
            })}
            {participantsList.length > 2 ? (
              <span> +{participantsList.length - 2} more</span>
            ) : (
              ""
            )}
          </div>
          <div className="flex gap-5">
            <TimePicker
              views={["hours", "minutes"]}
              ampm={true}
              name="startTime"
              value={event.start}
              onChange={(selectedTime) => handleInput("start", selectedTime)}
            />
            <TextField
              label="duration in hrs"
              name="duration"
              value={event.duration}
              onChange={(e) => handleInput("duration", e.target.value)}
            />
          </div>

          <TextField
            label="Session notes"
            name="sessionNote"
            value={event.sessionNote}
            onChange={(e) => handleInput("sessionNote", e.target.value)}
          />

          <div className="flex gap-5 justify-center mt-2">
            <Button
              variant="outlined"
              sx={{ background: "#fff" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEvent}>
              Update Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
