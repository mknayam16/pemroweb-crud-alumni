'use client';

import React, { createContext, useReducer, useEffect, useState, ReactNode } from 'react';
import AuthReducer from './AuthReducer';

// Define types for the context state
type User = {
    id: string;
    name: string;
    email: string;
    token: string;
};

type AuthState = {
    currentUser: User | null;
    userToken: string | null;
    };

type AuthContextProps = {
    currentUser: User | null;
    userData: User | Record<string, unknown>; // User data or empty object if not fetched yet
    dispatch: React.Dispatch<any>;
};

// Initial state with type definitions
const INITIAL_STATE: AuthState = {
    currentUser: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    userToken: typeof window !== 'undefined' ? localStorage.getItem('user_token') : null,
};

// Create context with default value
export const AuthContext = createContext<AuthContextProps>({
    currentUser: null,
    userData: {},
    dispatch: () => null,
});

// Define props for the provider component
type AuthContextProviderProps = {
    children: ReactNode;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [data, setData] = useState<User | Record<string, unknown>>({});

  // Effect to sync state with localStorage
    useEffect(() => {
        if (state.currentUser) {
            localStorage.setItem('user', JSON.stringify(state.currentUser));
        } else {
            localStorage.removeItem('user');
        }

    if (state.userToken) {
            localStorage.setItem('user_token', state.userToken);
        } else {
            localStorage.removeItem('user_token');
        }
    }, [state.currentUser, state.userToken]);

  // Fetch user data when userToken changes
    useEffect(() => {
        const fetchUser = async () => {
        if (state.userToken) {
            try {
            const response = await fetch('http://127.0.0.1:8000', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${state.userToken}`,
                    Accept: 'application/json',
                },
            });
            const userData = await response.json();
            if (response.ok) {
                dispatch({
                    type: 'SET_USER',
                    payload: userData,
                });
                setData(userData);
            } else {
                console.error('Error fetching user data');
            }
            } catch (error) {
            console.error('Error fetching user data:', error);
            }
        }
        };

        fetchUser();
    }, [state.userToken, dispatch]);

    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch, userData: data }}>
        {children}
        </AuthContext.Provider>
    );
};