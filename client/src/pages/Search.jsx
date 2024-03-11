import { Button, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Select } from "flowbite-react";
import PostCard from "../components/PostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);

      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setLoading(false);
        setPosts(data.posts);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      const order = e.tartget.value || "desc";
      setSidebarData({
        ...sidebarData,
        sort: order,
      });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorzied";
      setSidebarData({
        ...sidebarData,
        category,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);

    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className=" flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className=" flex items-center gap-2">
            <label className=" font-semibold whitespace-nowrap">Search Term:</label>
            <TextInput placeholder="Search..." type="text" id="searchTerm" value={sidebarData.searchTerm} onChange={handleChange} />
          </div>
          <div className=" flex items-center gap-2">
            <label className=" font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort" value={sidebarData.sort}>
              <option value="desc">Lasted</option>
              <option value="asc">Olded</option>
            </Select>
          </div>
          <div className="flex  items-center gap-2">
            <label className=" font-semibold">Category:</label>
            <Select onChange={handleChange} id="category" value={sidebarData.category}>
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option> <option value="javascript">Javascript</option>
            </Select>
          </div>
          <Button gradientDuoTone={"purpleToPink"} outline type="submit">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="p-3 mt-5 text-3xl font-semibold sm:border-b border-gray-500">Posts results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && <p className=" text-gray-500 text-xl">No posts found.</p>}
          {loading && <p className=" text-xl text-gray-500">Loading...</p>}
          {!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button onClick={handleShowMore} className=" text-center text-teal-500 hover:underline w-full text-lg">
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
