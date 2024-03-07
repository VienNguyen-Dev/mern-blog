import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  console.log(post);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);

        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchPost();
  }, [postSlug]);

  if (loading) {
    return (
      <div className=" flex items-center justify-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );
  }
  return (
    <main className=" flex flex-col p-3 max-w-6xl mx-auto min-h-screen ">
      <h1 className="text-center font-serif text-3xl p-3 mt-10 max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
      <Link to={`/search?category=${post && post.category}`} className=" self-center mx-auto">
        <Button color="gray" pill size={"xs"}>
          {post && post.category}
        </Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className="p-3 mt-10 w-full object-cover m-h-[600px]" />
      <div className="flex justify-between border-b border-slate-500 mx-auto max-w-2xl p-3 w-full text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>

        <span className=" italic">{post && (post.content.length / 1000).toFixed(0)} minutes read</span>
      </div>
      <div className=" p-3 mx-auto max-w-2xl w-full post-content" dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
    </main>
  );
}
