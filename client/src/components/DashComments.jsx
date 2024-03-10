import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";

import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  console.log(comments);

  useEffect(() => {
    const fetchComments = async () => {
      setShowModal(false);
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" table-auto md:mx-auto p-3 overflow-x-scroll  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>

              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className=" divide-y">
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>

                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell className=" text-red-500 font-md hover:underline cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true), setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </span>
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
        <p>You have no comment yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} size={"md"} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto w-14 h-14 text-gray-400 dark:text-gray-200 mb-4" />
            <h3 className="mb-5 text-gray-500 dark:text-gray-400">Are you sure you want to delete this comment?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
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
