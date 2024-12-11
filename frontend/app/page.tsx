"use client";
import Link from "next/link";
import TableData from "@/components/tabledata";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setUserName(data.name);
          } else {
            setUserName(null);
            router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          router.push("/login");
        });
    } else {
      router.push("/login");
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        localStorage.removeItem("access_token");
        setUserName(null);
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="card bg-white shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Buat, Edit, dan Hapus Post
            </h1>
            <button
              className="btn btn-error text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-600">
                {userName ? `Hello, ${userName}` : "Hello, Guest"}
              </p>
            </div>
            <Link href="/posts/create" className="btn btn-primary">
              Create Post
            </Link>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="card bg-white shadow-lg p-5">
          <TableData />
        </div>
      </div>
    </div>
  );
}