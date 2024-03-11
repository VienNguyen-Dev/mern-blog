import React from "react";
import CallToAction from "../components/CallToAction";

export default function Projects() {
  return (
    <div className=" min-h-screen max-w-2xl mx-auto p-3 flex flex-col gap-6 items-center justify-center">
      <h1 className=" text-3xl font-semibold py-7 text-center">Projects</h1>
      <p className=" text-gray-500 text-md">Build fun and engaging projects while learning HTML, CSS, and JavaScript!</p>
      <CallToAction />
    </div>
  );
}
