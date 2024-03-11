import React from "react";

export default function About() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className=" max-w-3xl mx-auto p-3 text-center">
        <div>
          <h3 className=" text-3xl font-semibold py-7 text-center">About VienNguyen's Blog</h3>

          <div className=" flex flex-col text-gray-500 text-md gap-6">
            <p>
              Welcome to VienNguyen's Blog! This blog was created by VienNguyen as a personal project to share his thoughts and ideas with the world. VienNguyen is a passionate developer who loves to
              write about technology, coding, and everything in between.
            </p>
            <p>
              {" "}
              On this blog, you'll find weekly articles and tutorials on topics such as web development, software engineering, and programming languages. Sahand is always learning and exploring new
              technologies, so be sure to check back often for new content!
            </p>
            <p>
              We encourage you to leave comments on our posts and engage with other readers. You can like other people's comments and reply to them as well. We believe that a community of learners can
              help each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
