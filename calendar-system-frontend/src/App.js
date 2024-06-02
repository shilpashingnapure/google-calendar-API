import "./App.css";
import { CalendarView } from "./Compoents/calendar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./Compoents/home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </div>
  );
}

export default App;



