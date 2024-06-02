import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Cookies from "js-cookie";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Hidden,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import moment from "moment/moment";

export const CalendarView = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openEventDetails, setOpenEventDetails] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [seletectedDate, setSelectedDate] = useState();
  const [data, setData] = useState();
  const token = Cookies.get("authToken");
  function handleDateClick(arg) {
    setSelectedDate(arg.dateStr);
    setOpenForm(true);
    getEvents();
  }

  function handleFormClose() {
    setOpenForm(false);
    getEvents();
  }

  useEffect(() => {
    getEvents();
  }, []);

  async function getEvents() {
    const res = await fetch("http://localhost:8000/events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setData(data);
  }

  function handleEventClick(data) {
    setOpenEventDetails(true);
    setEventDetails(data);
  }

  // to show content UI
  function renderEventContent(eventInfo) {
    // console.log(eventInfo);
    // console.log(eventInfo.event.extendedProps);
    return (
      <div
        onClick={() => handleEventClick(eventInfo)}
        style={{
          overflow: "hidden",
          background: "#1876d2",
          borderRadius: "5px",
          padding: "2px 5px",
          margin: "0 4px",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <i>{eventInfo.timeText + "m "}</i>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }

  return (
    <div className="calendar-view flex flex-col gap-1 bg-blue-400 h-screen">
      <header className="absolute right-0 p-5">
        <Avatar sx={{ width: "70px", height: "70px" }} />
      </header>
      <div
        className={`h-[75vh] ${
          openForm ? "w-[80%]" : "w-[50%]"
        } m-auto shadow-md flex p-4 gap-5  bg-white`}
      >
        <div className="flex-1">
          <FullCalendar
            width="100%"
            height="100%"
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            events={data}
            eventContent={renderEventContent}
          ></FullCalendar>
        </div>

        <ScheduleForm
          open={openForm}
          onClose={handleFormClose}
          currDate={seletectedDate}
        />
      </div>

      <EventDetails open={openEventDetails} data={eventDetails} />
    </div>
  );
};

function EventDetails({ open, data }) {
  if (!open) {
    return;
  }
  return (
    <Dialog open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <div>{data.event.title}</div>
        <div>{new Date(data.event.start).toISOString()}</div>
        <div>{new Date(data.event.end).toISOString()}</div>
        <div>{data.event.extendedProps.description}</div>
        <div>{data.event.extendedProps.participants}</div>
        <div>{data.event.extendedProps.sessionNote}</div>
      </DialogContent>
      <DialogActions>
        <Button>Save</Button>
        <Button>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export const ScheduleForm = ({ open, onClose, currDate }) => {
  const fullDate = moment(currDate);
  const formattedDate = fullDate.format("dddd, MMM D");

  async function handleEvent(e) {
    e.preventDefault();

    const {
      eventName,
      eventDescription,
      participants,
      eventDate,
      startTime,
      endTime,
      sessionNote,
    } = e.target;

    const startDateTime = new Date(
      eventDate.value + " " + startTime.value
    ).toISOString();
    const endDateTime = new Date(
      eventDate.value + " " + endTime.value
    ).toISOString();
    const event = {
      title: eventName.value,
      description: eventDescription.value,
      participants: participants.value,
      date: eventDate.value,
      start: startDateTime,
      end: endDateTime,
      sessionNote: sessionNote.value,
    };

    const token = Cookies.get("authToken");
    const res = await fetch("http://localhost:8000/create-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    onClose();
  }

  if (!open) {
    return;
  }
  return (
    // <Dialog open={open} onClose={onClose}>
    //   <DialogTitle>Schedule Form</DialogTitle>
    //   <DialogContent>
    //     <form onSubmit={(e) => handleEvent(e)}>
    //       <TextField label="event title" name="eventName" />
    //       <TextField label="Description" name="eventDescription" />
    //       <TextField label="list of participants" name="participants" />
    //       <DatePicker name="eventDate" value={dayjs(currDate)} />
    //       <TimePicker
    //         views={["hours", "seconds"]}
    //         ampm={true}
    //         name="startTime"
    //       />
    //       <TimePicker views={["hours", "seconds"]} ampm={true} name="endTime" />
    //       <TextField label="Session notes" name="sessionNote" />
    //       <Button type="submit">Add Event</Button>
    //     </form>
    //   </DialogContent>
    // </Dialog>
    <div className="basis-[40%] border-2 bg-blue-200 py-5 px-4 rounded-lg">
      <h1>Scjedule Meet</h1>
      <div className="text-start">
        <form
          onSubmit={(e) => handleEvent(e)}
          className="flex flex-col px-8 gap-4"
        >
          <div className="text-md"><b>{formattedDate}</b></div>
          <TextField label="event title" name="eventName" />
          <TextField label="Description" name="eventDescription" />
          <TextField label="list of participants" name="participants" />
          <div className="flex gap-5">
            <TimePicker
              views={["hours", "seconds"]}
              ampm={true}
              name="startTime"
            />
            <TimePicker
              views={["hours", "seconds"]}
              ampm={true}
              name="endTime"
            />
          </div>

          <TextField label="Session notes" name="sessionNote" />

          <div className="flex gap-5 justify-center">
            <Button variant="outlined" sx={{ background: "#fff" }}>
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
