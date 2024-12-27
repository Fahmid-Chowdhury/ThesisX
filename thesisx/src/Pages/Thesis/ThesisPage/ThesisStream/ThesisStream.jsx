import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; // Import the socket.io client
import { useParams } from 'react-router-dom'; // To get the thesis id from the URL

const ThesisStream = () => {
    const { id } = useParams(); // Get thesis id from URL
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize the socket connection
        const newSocket = io('http://localhost:8080'); // Replace with your server URL
        setSocket(newSocket);

        // Join the specific room for this thesis
        const token = localStorage.getItem('authToken');
        newSocket.emit('joinRoom', { roomId: id, token });

        // Listen for new posts and comments
        newSocket.on('newPost', (post) => {
            console.log('New post:', post);
            setPosts((prevPosts) => [post, ...prevPosts]); // Prepend new post
        });

        return () => {
            newSocket.disconnect(); // Cleanup socket on unmount
        };
    }, [id]);

    // Fetch posts from the API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const apiDomain = import.meta.env.VITE_API_DOMAIN;
                const response = await fetch(`${apiDomain}/api/thesis/posts/${id}`, {
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

        fetchPosts();
    }, [id]);

    // Handle new post submission
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const apiDomain = import.meta.env.VITE_API_DOMAIN;

        try {
            // Emit a socket event to create a new post
            socket.emit('createPost', { roomId: id, postData: newPost, token }, async (response) => {
                if (response.success) {
                    setNewPost({ title: '', content: '' }); // Clear the form
                } else {
                    console.error('Error creating post:', response.message);
                }
            });
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    // Handle post input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    return (
        <div className="thesis-stream">
            <h1>Thesis Stream</h1>

            {/* Post Submission Form */}
            <form onSubmit={handlePostSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={newPost.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={newPost.content}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Post</button>
            </form>

            <div className="posts">
                {/* Display posts */}
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <div className="comments">
                            {/* Display comments here */}
                            {post.comments?.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <p>{comment.content}</p>
                                </div>
                            ))}
                            {/* Add a form to submit comments */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    // Handle creating comment (this can be emitted to socket server)
                                }}
                            >
                                <textarea placeholder="Add a comment" required></textarea>
                                <button type="submit">Comment</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThesisStream;
