import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/theme.Slice";
import { signoutFailure, signoutStart, signoutSuccess } from "../redux/user/userSlice";

//access website: flowbitereact.com
export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const dispatch = useDispatch();
  const handleSignout = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutFailure(data.message));
        return;
      } else {
        dispatch(signoutSuccess(data));
      }
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };
  return (
    <Navbar className=" border-b-2">
      <Link to={"/"} className=" self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl">Shahan's</span>
        Blog
      </Link>
      <form>
        <TextInput type="text" placeholder="Search..." rightIcon={AiOutlineSearch} className=" hidden lg:inline" />
      </form>
      <Button className=" lg:hidden w-12 h-10" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className=" hidden sm:inline w-12 h-10" pill color="gray" onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}>
            <Dropdown.Header>
              <span className=" block text-sm">@{currentUser.username}</span>
              <span className=" block text-sm font-medium truncate">{currentUser.email}</span>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>

              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown.Header>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone={"purpleToBlue"}>Sign In</Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
