import { Login } from "./login";

export const Home = () => {
    return (
      <div className="flex justify-center align-center flex-col h-screen">
        <img src="./calendar.png" alt='' className="w-[40%]  absolute z-[-1] bottom-0 right-0 object-contain"/>
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