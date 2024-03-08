import React from "react";
import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row border border-teal-500 p-3 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex flex-col flex-1 justify-center items-center gap-2">
        <h2 className=" text-2xl">Want to learn more about Javascript?</h2>
        <p className=" text-gray-500 my-2">Checkout these resources with 100 JavaScript Projects</p>
        <Button gradientDuoTone={"purpleToPink"} className=" rounded-tl-xl rounded-bl-none">
          <a href="https://www.100jsprojects.com" target="_blank" rel="noopener noreferrer">
            100 JavaScript Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://www.freecodecamp.org/news/content/images/2021/06/javascriptfull.png" alt="javascript" />
      </div>
    </div>
  );
}
