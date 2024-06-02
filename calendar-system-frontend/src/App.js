import logo from "./logo.svg";
import "./App.css";
import { CalendarView } from "./Compoents/calendar";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import Cookies from "js-cookie";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

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

const Home = () => {
  return (
    <div className="flex justify-center align-center flex-col h-screen">
      <img src="./calendar.png" className="w-[40%]  absolute z-[-1] bottom-0 right-0 object-contain"/>
      <div>
        <div className="text-center flex flex-col gap-8">
          <h1 className="text-6xl "> <span className="bg-green-500 px-3 text-white">Welcome</span> to Our Event Coordination Center!</h1>
          <p className="text-4xl ">Synchronize your calendar with us!</p>
        </div>
      </div>
      <div>
        <Login />
      </div>
    </div>
  );
};

const Login = () => {
  async function handleLogin(googleResponse) {
    const { code } = googleResponse;
    const res = await fetch("http://localhost:8000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const { token } = await res.json();
    Cookies.set("authToken", token);

    window.location.href = "/calendar";
  }
  const login = useGoogleLogin({
    onSuccess: (res) => handleLogin(res),
    flow: "auth-code",
    scope: " https://www.googleapis.com/auth/calendar",
    ux_mode: "popup",
  });

  return (
    <div className="flex justify-center mt-[50px] flex-col items-center gap-3">
      <button
        onClick={() => login()}
        className="shadow-lg flex items-center justify-center rounded-md border-none bg-blue-500 px-2 pr-5 py-2  text-2xl text-white text-[20px] gap-5 "
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6WwgH7Nl5_AW9nDCnR2Ozb_AU3rkIbSJdAg&s"
          className="w-[40px] h-[40px]"
        />
        <span>Login In</span>
      </button>
      <p>Ready to Dive In? Log In Here!</p>
    </div>
  );
};
