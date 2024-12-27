import React, { useContext, useState } from 'react';
import { ThesisStreamContext } from '../../../../Contexts/ThesisStreamContext/ThesisStreamContext';
import { useParams } from 'react-router-dom';

const PostForm = () => {
    const { socket, setPosts } = useContext(ThesisStreamContext);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    const { id } = useParams(); // Get thesis id from URL

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        socket.emit('createPost', { postData: newPost, token, roomId:id }, (response) => {
            if (response.success) {
                setNewPost({ title: '', content: '' });
            } else {
                console.error('Error creating post:', response.message);
            }
        });
    };

    return (
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
    );
};

export default PostForm;
