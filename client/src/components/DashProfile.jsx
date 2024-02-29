import { Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setfile] = useState(undefined);
  const [formData, setformData] = useState({});

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleUpload = async () => {};
  return (
    <div className=" max-w-lg mx-auto p-3 w-full">
      <h1 className=" font-semibold text-3xl text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 cursor-pointer self-center shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full border-8 border-[lightgray] object-cover"
            onClick={handleUpload}
            onChange={(e) => setfile(e.target.files[0])}
          />
        </div>
        <TextInput type="text" id="username" placeholder="Your username" onChange={handleChange} defaultValue={currentUser.username} />
        <TextInput type="email" id="email" placeholder="Your email" onChange={handleChange} defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className=" text-red-500 flex justify-between mt-2">
        <span className=" hover:underline cursor-pointer ">Delete Account</span>
        <span className="hover:underline cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
