"use client";
 
import React, { useState, useEffect } from "react";
//import axios from 'axios' //npm install axios https://www.npmjs.com/package/axios
import { useRouter } from "next/navigation";
 

const CreatePost = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);    
    const [userName, setUserName] = useState<string | null>(null);
    const [postField, setPostField] = useState({ title: "", body: "" });
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
    },  []);
    
    // const changeUserFieldHandler = (e) => {
    //     setPostField({
    //         ...postField,
    //         [e.target.name]: e.target.value
    //     });
    //     //console.log(userField);
    // }
    
    const changeUserFieldHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPostField({
          ...postField,
          [e.target.name]: e.target.value,
        });
      };
    
    const onSubmitChange = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        if (token) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postField),});
                if (response.ok) {
                    // Redirect to home page on successful submission
                    router.push("/");
                  } else {
                    console.error("Failed to submit post:", await response.json());
                  }
                } catch (error) {
                  console.error("Error submitting post:", error);
                }
              } else {
                console.error("No token available for submission");
              }
    };
    return (
        <div className="max-w-md mx-auto mt-5">
          <h1 className="text-2xl text-center mb-2">Upload Notes</h1>
          <div>
            <form onSubmit={onSubmitChange}>
              <div className="mb-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered input-primary w-full max-w-xs"
                  placeholder="Title..."
                  value={postField.title}
                  onChange={changeUserFieldHandler}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="body" className="block text-sm font-medium text-gray-900">
                  Body
                </label>
                <textarea
                  name="body"
                  className="textarea textarea-bordered textarea-primary w-full max-w-xs"
                  placeholder="Input your notes"
                  value={postField.body}
                  onChange={changeUserFieldHandler}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create Post
              </button>
            </form>
          </div>
        </div>
      );
    };    
   
export default CreatePost;