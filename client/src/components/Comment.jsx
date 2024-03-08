import React, { useEffect, useState } from "react";
import moment from "moment";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.messgae);
      }
    };
    getUser();
  }, [comment.userId]);
  return (
    <div className="flex  p-4 border-b dark:border-gray-600 text-sm">
      <div className=" flex-shrink-0 mr-3">
        <img src={user.profilePicture} alt={user.username} className="w-10 h-10 bg-gray-200 object-cover rounded-full" />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className=" font-bold text-xs truncate mr-1">{user ? `@${user.username}` : "anonymous user"}</span>
          <span className=" text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className=" text-gray-500 pb-2">{comment.content}</p>
      </div>
    </div>
  );
}
