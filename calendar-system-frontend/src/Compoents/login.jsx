import Cookies from "js-cookie";
import {
    useGoogleLogin,
  } from "@react-oauth/google";
import { MAIN_URL } from "../utilites/rest.methods";

export const Login = () => {
    async function handleLogin(googleResponse) {
      const { code } = googleResponse;
      const res = await fetch(`${MAIN_URL}/auth/google`, {
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
            alt=''
          />
          <span>Login In</span>
        </button>
        <p>Ready to Dive In? Log In Here!</p>
      </div>
    );
  };
  