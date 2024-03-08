import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  console.log(comments);
  const [commentError, setcommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setcommentError(data.message);
      }
      if (res.ok) {
        setComment("");
        setcommentError(null);
        setComments([data, ...comment]);
      }
    } catch (error) {
      setcommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          return;
        }
        if (res.ok) {
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);
  return (
    <div className="max-w-2xl mx-auto p-3 w-full">
      {currentUser ? (
        <div className="flex gap-1 items-center my-5 text-sm text-gray-500">
          <p className="">Signed in as: </p>
          <img src={currentUser.profilePicture} className="w-6 h-6 object-cover rounded-full" />
          <Link to={"/dashboard?tab=profile"} className=" text-cyan-500 text-xs hover:underline">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 text-sm text-teal-500 my-5">
          You must be signed to comment.
          <Link className=" text-blue-500 hover:underline" to={"/sign-in"}>
            Sign in
          </Link>
        </div>
      )}

      {currentUser && (
        <form onSubmit={handleSubmit} className=" border border-teal-500 p-3 rounded-md">
          <Textarea placeholder="Add a comment..." rows={"3"} maxLength={"200"} onChange={(e) => setComment(e.target.value)} value={comment} />
          <div className="flex mt-5 justify-between items-center ">
            <p className=" text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
            <Button disabled={comment.length === 0} type="submit" outline gradientDuoTone={"purpleToBlue"}>
              Submit
            </Button>
          </div>
        </form>
      )}
      {commentError && <Alert color={"failure"}>{commentError} </Alert>}
      {comments.length === 0 ? (
        <p className=" text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className=" text-sm flex gap-1 items-center my-5">
            <p>Comments </p>
            <p className=" border border-x-gray-400 py-1 px-2 rounded-sm">{comments.length}</p>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
}
