import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { ScheduleCreateForm } from "./event.create";
import { ScheduleUpdateForm } from "./event.update";
import { EventDetails } from "./event.detail";
import { getMethod } from "../utilites/rest.methods";

export const CalendarView = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openEventDetails, setOpenEventDetails] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [seletectedDate, setSelectedDate] = useState();
  const [data, setData] = useState([]);


  // When click on date , should open the create event form
  function handleDateClick(arg) {
    setSelectedDate(arg.dateStr);
    setOpenCreateForm(true);
    setOpenEditForm(false);
    getEvents();
  }

  // when form is close , call get events api
  function handleFormClose() {
    setOpenCreateForm(false);
    setOpenEditForm(false);
    getEvents();  
  }

  async function getEvents() {
    let events = await getMethod('/events');
    setData([...events]);
  }

  useEffect(() => {
    getEvents();
  }, [openEditForm]);


  

  // on click pop with that event details will show
  function showEventDetail(data) {
    setOpenEventDetails(true);
    setEventDetails(data);
  }

  // on click open update event form 
  function handleUpdateFormState() {
    setOpenEventDetails(false);
    setOpenCreateForm(false);
    setOpenEditForm( () => true);
  }

  // to show each event in calendar UI
  function renderEventContent(eventInfo) {
    return (
      <div
        onClick={() => showEventDetail(eventInfo)}
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
          openCreateForm || openEditForm ? "w-[80%]" : "w-[50%]"
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
        
        {/* create Event form  */}
        <ScheduleCreateForm
          open={openCreateForm}
          onClose={handleFormClose}
          currDate={seletectedDate}
        />

        {/* update Event form  */}
        { openEditForm && <ScheduleUpdateForm
          open={openEditForm}
          onClose={handleFormClose}
          data={eventDetails}
        />
        }
      </div>

      <EventDetails
        open={openEventDetails}
        data={eventDetails}
        onClose={() => setOpenEventDetails(false)}
        edit={handleUpdateFormState}
      />
    </div>
  );
};
