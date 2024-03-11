import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiAnnotation, HiArrowNarrowUp, HiOutlineDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers(), fetchPosts(), fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className=" flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 w-full dark:bg-slate-800 md:w-72 rounded-md shadow-md gap-4">
          <div className="flex justify-between">
            <div className="">
              <h3 className=" uppercase text-gray-500 text-md">Total users</h3>
              <p className=" text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className=" bg-teal-600 text-white rounded-full p-3 text-5xl shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className=" text-gray-500"> Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 w-full dark:bg-slate-800 md:w-72 rounded-md shadow-md gap-4">
          <div className="flex justify-between">
            <div className="">
              <h3 className=" uppercase text-gray-500 text-md">Total comments</h3>
              <p className=" text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className=" bg-indigo-600 text-white rounded-full p-3 text-5xl shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className=" text-gray-500"> Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 w-full dark:bg-slate-800 md:w-72 rounded-md shadow-md gap-4">
          <div className="flex justify-between">
            <div className="">
              <h3 className=" uppercase text-gray-500 text-md">Total posts</h3>
              <p className=" text-2xl">{totalPosts}</p>
            </div>
            <HiOutlineDocumentText className=" bg-lime-600 text-white rounded-full p-3 text-5xl shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className=" text-gray-500"> Last month</div>
          </div>
        </div>
      </div>
      <div className=" flex flex-wrap gap-4 py-3 justify-center mx-auto">
        <div className=" flex flex-col md:w-auto w-full shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className=" text-center p-2">Recent users</h1>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className=" divide-y">
                  <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                    <Table.Cell>
                      <img src={user.profilePicture} alt="user" className="w-10 h-10 rounded-full bg-gray-500" />
                    </Table.Cell>
                    <Table.Cell className=" font-semibold">{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className=" flex flex-col md:w-auto w-full shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className=" text-center p-2">Recent comments</h1>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className=" divide-y">
                  <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                    <Table.Cell className="w-96">
                      <p className=" line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell className=" font-semibold">{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className=" flex flex-col md:w-auto w-full shadow-md p-2 rounded-md dark:bg-slate-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className=" text-center p-2">Recent posts</h1>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Post category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className=" divide-y">
                  <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                    <Table.Cell>
                      <img src={post.image} alt="user" className="w-14 h-10 rounded-md bg-gray-500" />
                    </Table.Cell>
                    <Table.Cell className=" font-semibold w-96">
                      <p>{post.title}</p>
                    </Table.Cell>
                    <Table.Cell className=" fw-5">
                      <p>{post.category}</p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
