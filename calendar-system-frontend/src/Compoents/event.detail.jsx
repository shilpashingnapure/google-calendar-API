import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";
import NotesIcon from "@mui/icons-material/Notes";
import PeopleIcon from "@mui/icons-material/People";
import FaceIcon from "@mui/icons-material/Face";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import moment from "moment/moment";
import { deleteMethod } from "../utilites/rest.methods";
export function EventDetails({ open, data, onClose, edit }) {
    if (!open) {
      return;
    }
    // delete event
    async function handleDeleteEvent() {
      await deleteMethod(`/delete-event/${data.event.extendedProps.googleEventId}`)
      onClose();
    }
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <h1 className="text-[35px]">{data.event.title}</h1>
            <div className="flex justify-end gap-4">
              <button>
                <EditIcon onClick={edit} />
              </button>
              <button onClick={handleDeleteEvent}>
                <DeleteIcon />
              </button>
              <button onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <div className="flex gap-4 items-center ">
            <DateRangeIcon />
            <div>{moment(data.event.start).format("dddd, MMM D")}</div>
          </div>
  
          <div className="flex gap-4 items-center ">
            <ScheduleIcon />
            <div className="flex gap-2 ">
              <span>{moment(data.event.start).format("hh:mm a")}</span> -
              <span>{moment(data.event.end).format("hh:mm a")}</span>
            </div>
          </div>
          <div className="flex gap-4 items-center ">
            <NotesIcon />
            <div>{data.event.extendedProps.description}</div>
          </div>
  
          <div className="flex gap-4 items-center ">
            <DescriptionIcon />
  
            <div>{data.event.extendedProps.sessionNote}</div>
          </div>
  
          <div className="flex gap-4 items-center ">
            <PeopleIcon />
            <div>
              <div className="flex gap-3">
                {data.event.extendedProps.participants.map((item) => {
                  return <Chip icon={<FaceIcon />} label={item.email} />;
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }