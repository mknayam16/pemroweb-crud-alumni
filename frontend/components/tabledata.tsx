import React, { useEffect, useState } from "react";
import Link from "next/link";

const TableData = () => {
  interface Post {
    id: number;
    user_id: string;
    title: string;
    body: string;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const getUserIdFromToken = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Access token not found");
      return null;
    }
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch user data");
        return null;
      }
      const userData = await response.json();
      return userData.id; // Assuming `id` exists in the response
    } catch (error) {
      console.error("Failed to get user id:", error);
      return null;
    }
  };

  const fetchPosts = async (currentUserId: string | null) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Access token not found");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch posts");
        return;
      }

      const data: Post[] = await response.json();
      const filteredPosts = data.filter((post) => post.user_id === currentUserId);
      setPosts(filteredPosts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const id = await getUserIdFromToken();
      setUserId(id);
      fetchPosts(id);
    };
    initialize();
  }, []);

  const deletePost = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Access token not found");
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <table className="table table-zebra">
      <thead className="text-sm text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="py-3 px-6">#</th>
          <th className="py-3 px-6">Title</th>
          <th className="py-3 px-6">Body</th>
          <th className="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={post.id} className="bg-white text-black border-b">
            <td className="py-3 px-6">{index + 1}</td>
            <td className="py-3 px-6">{post.title}</td>
            <td className="py-3 px-6">{post.body}</td>
            <td className="flex justify-center gap-1 py-3">
              {/* <Link href={`#`} className="btn btn-info">
                View
              </Link> */}
              {/* Edit Button with Dynamic Link */}
              <Link
                href={`/posts/${post.id}/edit`}
                className="btn btn-primary"
              >
                Edit
              </Link>
              <button
                onClick={() => deletePost(post.id)}
                className="btn text-white bg-red-500"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableData;