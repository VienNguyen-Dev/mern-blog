import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex flex-col p-3 max-w-3xl mx-auto md:flex-row md:items-center gap-5">
        {/* Left side */}
        <div className="lex-1">
          <Link to={"/"} className=" dark:text-white font-bold text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Shahan's </span> Blog
          </Link>
          <p className=" text-sm mt-5">This is a demo project.You can sign up with your email and password or with Google</p>
        </div>
        {/* Right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput type="email" placeholder="name@company.com" id="email" />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="Password" id="password" />
            </div>
            <Button type="submit" gradientDuoTone={"purpleToPink"}>
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/sing-in"} className="hover:underline text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
