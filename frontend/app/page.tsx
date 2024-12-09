"use client"
import Link from "next/link";
import TableData from "@/components/tabledata";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    //const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
        // Memanggil endpoint untuk mendapatkan data user
        fetch("http://localhost:8000/api/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.name) {
                    setIsLoggedIn(true);
                    setUserName(data.name);
                } else {
                    setIsLoggedIn(false);
                    setUserName(null);
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                setIsLoggedIn(false);
            });
    } else {
        setIsLoggedIn(false);
    }
}, []);

const handleLogout = async () => {
  const token = localStorage.getItem("access_token");
  if (token) {
      try {
          await fetch("http://127.0.0.1:8000/api/logout", {
              method: "POST",
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "application/json",
              },
          });
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
          setUserName(null);
          router.push("/login");
      } catch (error) {
          console.error("Logout failed:", error);
      }
  }
};

  return (
    <div className="w-screen py-20 flex justify-center flex-col items-center">
      <div className="flex items-center justify-between gap-1 mb-5">
        <h1 className="text-4xl font-bold">
          Buat, Edit, dan Hapus Post
        </h1>
      </div>
      <div className="overflow-x-auto w-full px-5">
        <div className="flex justify-between items-center mb-5">
          {/* User greeting */}
          <div className="text-right">
            {userName ? (
              <p className="text-lg font-semibold">Hello, {userName}</p>
            ) : (
              <p className="text-lg font-semibold">Hello, Guest</p>
            )}
          </div>

          {/* Register and Login Links */}
          <div className="flex gap-2">
            <Link href="/register" className="btn btn-secondary">
              Register
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
            <button
                                    className="btn bg-red-500 border-none text-white hover:bg-red-700"
                                    onClick={() =>  handleLogout()} >
                                    Logout
                                </button>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="mb-2 w-full text-right">
          <Link href="/posts/create" className="btn btn-primary">
            Create
          </Link>
        </div>

        {/* Table Data */}
        <TableData />
      </div>
    </div>
  );
}