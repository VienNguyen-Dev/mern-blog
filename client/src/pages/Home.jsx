import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col px-3 p-28 max-w-6xl mx-auto gap-6">
        <h1 className=" text-3xl font-bold md:text-6xl">Wellcome to my Blog</h1>
        <p className=" text-gray-500 text-xs md:text-sm"> Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
        <Link className=" text-teal-500 hover:underline text-xs sm:text-sm font-bold" to={"/search"}>
          View all posts
        </Link>
      </div>
      <div className=" p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="flex flex-col gap-8 p-3 py-7 max-w-6xl mx-auto ">
        {posts && posts.length > 0 && (
          <div
            className="flex flex-col gap-6
      "
          >
            <h2 className=" text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link className=" text-lg text-teal-500 hover:underline text-center" to={"/search"}>
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
