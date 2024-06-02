import { useState } from "react";
import moment from "moment/moment";
import FaceIcon from "@mui/icons-material/Face";

import { Button, Chip, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { postMethod } from "../utilites/rest.methods";

export const ScheduleCreateForm = ({ open, onClose, currDate }) => {
  const [participant, setParticipant] = useState();
  const [participantsList, setListParticipants] = useState([]);
  const fullDate = moment(currDate);
  const formattedDate = fullDate.format("dddd, MMM D");

  // create event
  async function handleEvent(e) {
    e.preventDefault();

    const { title, description, startTime, duration, sessionNote } = e.target;

    // convert into date
    const startDateTime = moment(currDate + " " + startTime.value);

    // calculate the end time between start time and duration
    const endDateTime = startDateTime.clone().add(duration.value, "hours");

    const event = {
      title: title.value,
      description: description.value,
      participants: participantsList,
      date: currDate,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      sessionNote: sessionNote.value,
    };
    await postMethod("/create-event", event);
    resetState();
  }

  function addparticipants() {
    setListParticipants([...participantsList, { email: participant }]);
    setParticipant(() => '');
  }

  function removeParticipant(index) {
    let participants = participantsList;
    participants.splice(index, 1);
    setListParticipants([...participants]);
  }

  function resetState(){
    setListParticipants([]);
    setParticipant('');
    onClose();
  }

  if (!open) {
    return;
  }
  return (
    <div className="basis-[40%] w-[40%] border-2 bg-blue-200 py-5 px-3 rounded-lg flex gap-4 flex-col">
      <h1 className="text-lg">Schedule Meet</h1>
      <div className="text-start">
        <form
          onSubmit={(e) => handleEvent(e)}
          className="flex flex-col px-8 gap-4"
        >
          <div className="text-md">
            <b>{formattedDate}</b>
          </div>
          <TextField label="event title" name="title" required />
          <TextField label="Description" name="description" required />

          {/* participents */}
          <div className="flex items-center gap-3">
            <TextField
              label="list of participants"
              onChange={(e) => setParticipant(e.target.value)}
              className="flex-1"
              value={participant}
              required={!participantsList.length}
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

          {/* lists of participents */}
          <div className="flex gap-3  flex-wrap items-center">
            {participantsList.map((item, index) => {
              if (index < 2) {
                return (
                  <Chip
                    icon={<FaceIcon />}
                    sx={{ width: "30%" }}
                    label={item.email}
                    onDelete={() => removeParticipant(index)}
                  />
                );
              }
              return -1
              
            })}
            { participantsList.length  > 2 ? <span> +{participantsList.length - 2} more</span> : ''}
          </div>

          {/* time and duration  */}
          <div className="flex gap-5">
            <TimePicker
              views={["hours", "minutes"]}
              ampm={true}
              name="startTime"
              required
            />
            <TextField label="duration in hrs" name="duration" required />
          </div>

          {/* notes */}

          <TextField label="Session notes" name="sessionNote" required />

          {/* buttons */}

          <div className="flex gap-5 justify-center mt-2">
            <Button
              variant="outlined"
              sx={{ background: "#fff" }}
              onClick={resetState}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Add Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
