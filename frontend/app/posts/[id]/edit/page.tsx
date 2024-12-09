"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EditPost = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState({ title: "", body: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try{
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Access token not found");
        return;
      }
        const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        
        if (!response.ok) {
          console.error("Failed to fetch post");
          return;
        }

        const data = await response.json();
        setPost(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setIsLoading(false);
      }
      
    };

    fetchPost();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Access token not found");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        console.log("Post updated successfully");
        router.push("/"); // Redirect to the home page after updating
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-5">
      <h1 className="text-2xl text-center mb-2">Edit Post</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-5">
          <label htmlFor="title" className="block text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={post.title}
            className="input input-bordered input-primary w-full max-w-xs"
            placeholder="Title..."
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="body" className="block text-sm font-medium text-gray-900">
            Body
          </label>
          <textarea
            name="body"
            value={post.body}
            className="textarea textarea-bordered textarea-primary w-full max-w-xs"
            placeholder="Input your notes"
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
