"use client"

import { Loader } from '../../components/loader'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import Link from 'next/link'
import { AuthContext } from '../context/AuthContext'

const Login = () => {

    const { dispatch } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setError('');
        // setShowError(false);
        // setIsLoading(true);
    
        if (!email || !password) {
            setError('Email dan password tidak boleh kosong');
           // setShowError(true);
            //setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            console.log('API Response:', data);
    
            if (response.ok && data.token) {
                localStorage.setItem("access_token", data.token);
                dispatch({
                    type: 'LOGIN',
                    payload: { token: data.token },
                });
                router.push('/'); // Navigasi hanya dilakukan jika kredensial benar
            } else {
                // Tampilkan error jika login gagal
                setError(data.message || 'Login gagal, silakan periksa kembali email dan password Anda');
                //setShowError(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Terjadi kesalahan, silakan coba lagi nanti');
            //setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    // const closeErrorPopup = () => {
    //     setShowError(false);
    // };

    
    return (
        <main className="bg-white flex justify-center items-center min-h-screen p-6">
            <div className='card bg-gray-200 w-96 shadow-xl px-12 pt-12'>
                <h1 className='font-bold text-4xl flex justify-center pb-8 text-black'>Login Page</h1>

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
                <button 
                    className='bg-blue-300 mt-8 rounded-xl text-black py-3 hover:bg-blue-400'
                    onClick={handleSignIn}
                    >
                        <p className='text-white'>Login</p>
                </button>
                <div className='flex justify-center py-6 px-4'>
                    <a className="link link-hover text-blue-500 hover:text-blue-600" href="/register">Buat akun disini jika belum ada</a>
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

export default Login