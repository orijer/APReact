import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Feed from './feedPosts/Feed';

const App = () => {
    // Assume you have a state to track whether the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentToken, setCurrentToken] = useState(null);

    useEffect(() => {
        setIsLoggedIn(true);
    }, [currentUser]);

    const handleLogin = async (token, userName) => {
        const response = await fetch("http://localhost:80/api/users/" + userName, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            return;
        }

        const userData = (await response.json())[0];
        setCurrentToken(token);
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentToken(null);
        setIsLoggedIn(false);
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />

                <Route path="/feed" element={isLoggedIn ? <Feed currentUser={currentUser} token={currentToken} logout={handleLogout} /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;