import React from "react";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center mt-3 mb-6">
        <h1 className=" text-5xl font-bold">Welcome To The Website</h1>
      </div>
      <p className="mt-5 text-center text-2xl">
        This is Website for Learning Purpose React as a Front-end and Laravel as
        a backend with APIs. Here I will Learn React with Authentication.
      </p>
      <div className="flex justify-center mt-6">
        <button className="bg-gray-600 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded m-3">
          Login
        </button>
        <button className="bg-gray-600 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded m-3">
          Register
        </button>
      </div>
    </>
  );
}
