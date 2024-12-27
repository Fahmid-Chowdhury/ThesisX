import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const ThesisStreamContext = createContext();

const ThesisStreamProvider = ({ roomId, children }) => {
    const [posts, setPosts] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:8080'); // Replace with your server URL
        setSocket(newSocket);

        const token = localStorage.getItem('authToken');
        newSocket.emit('joinRoom', { roomId, token });

        newSocket.on('newPost', (post) => {
            setPosts((prevPosts) => [post, ...prevPosts]); // Prepend new post
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    const fetchPosts = async () => {
        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/thesis/posts/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch posts');
            }
            setPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [roomId]);

    return (
        <ThesisStreamContext.Provider value={{ posts, setPosts, socket }}>
            {children}
        </ThesisStreamContext.Provider>
    );
};

export default ThesisStreamProvider;
