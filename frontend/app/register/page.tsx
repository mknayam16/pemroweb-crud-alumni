"use client"
import React, {SyntheticEvent, useState } from "react";
import {useRouter} from 'next/navigation';
import { Loader } from '../../components/loader';

const Register:React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
        if (password !== password_confirmation){
            setError("Password do not match");
            return;
        }

    setIsLoading(true);

    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name,
                email, 
                password,
                password_confirmation
            }),
        })
        
        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            localStorage.setItem("access_token", data.token);
            router.push('/')
        } else {
            setError(data.message || 'Register failed')
        }
    } catch (error) {
        console.error('SignUp error:', error);
        setError('SignUp failed');
    } finally {
        setIsLoading(false);
    }
}
  return (
    <main className="bg-white flex justify-center items-center min-h-screen p-6">
    <div className='card bg-gray-200 w-96 shadow-xl px-12 pt-12'>
        <h1 className='font-bold text-4xl flex justify-center pb-8 text-black'>Register Page</h1>

        <p className='text-black pb-1'>Name</p>
        <label className="input input-bordered flex items-center gap-2 bg-white">
            
        <input 
            type="text" 
            className="grow text-black" 
            placeholder="enter your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        </label>

        <p className='text-black pb-1'>Email</p>
        <label className="input input-bordered flex items-center gap-2 bg-white">
            
        <input 
            type="text" 
            className="grow text-black" 
            placeholder="enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        </label>
        
        <p className='text-black pb-1 pt-4'>Password</p>
        <label className="input input-bordered flex items-center gap-2 bg-white">
        <input 
            type="password" 
            className="grow text-black" 
            placeholder='enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        </label>

        <p className='text-black pb-1 pt-4'>Password Confirmation</p>
        <label className="input input-bordered flex items-center gap-2 bg-white">
        <input 
            type="password" 
            className="grow text-black" 
            placeholder='re-enter your password'
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        </label>

        <button 
            className='bg-blue-300 mt-8 rounded-xl text-black py-3 hover:bg-blue-400'
            onClick={handleRegister}
            >
                <p className='text-white'>Register</p>
        </button>
        <div className='flex justify-center py-6 px-4'>
            <a className="link link-hover text-blue-500 hover:text-blue-600" href="/login">Login disini jika sudah punya akun</a>
        </div>
    </div>

    {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <Loader size="lg" /> 
        </div>
    )}
</main>
  )
}

export default Register