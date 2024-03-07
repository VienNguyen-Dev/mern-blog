import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setpostIdToDelete] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      setShowModal(false);
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" table-auto md:mx-auto p-3 overflow-x-scroll  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className=" divide-y">
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className=" w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} className=" font-semibold dark:text-white text-gray-900">
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell className=" text-red-500 font-md hover:underline cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true), setpostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`} className=" text-teal-500 hover:underline">
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="my-7 self-center text-teal-500 w-full text-sm">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no post yest!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} size={"md"} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto w-14 h-14 text-gray-400 dark:text-gray-200 mb-4" />
            <h3 className="mb-5 text-gray-500 dark:text-gray-400">Are you sure you want to delete this post?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
