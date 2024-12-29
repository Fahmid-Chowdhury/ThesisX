import React, { useContext, useState } from 'react';
import { ThesisStreamContext } from '../../../../Contexts/ThesisStreamContext/ThesisStreamContext';
import { AuthContext } from '../../../../Contexts/Authentication/AuthContext';
import { GetStaticImage } from '../../../../utils/imageAPI';
import { useParams } from 'react-router-dom';

const PostForm = () => {
    const { socket, setPosts } = useContext(ThesisStreamContext);
    const [newPost, setNewPost] = useState({ content: '' });
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { user } = useContext(AuthContext);
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
        setLoading(true);
        const token = localStorage.getItem('authToken');
        socket.emit('createPost', { postData: newPost, token, roomId: id }, (response) => {
            if (response.success) {
                setNewPost({ content: '' });
                setOpen(false);
            } else {
                console.error('Error creating post:', response.message);
            }
        });
        setLoading(false);
    };

    return (
        <div className='bg-[hsl(0,0,100)] dark:bg-black border border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)] p-4 rounded-lg'>
            {
                open ? (
                    <form onSubmit={handlePostSubmit}>
                        <div>
                            <textarea
                                name="content"
                                value={newPost.content}
                                onChange={handleInputChange}
                                placeholder="What's on your mind?"
                                className="w-full border p-2 rounded bg-transparent border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)] dark:text-white"

                                required
                            />
                        </div>
                        <div className='flex items-center justify-end mt-2'>
                            <button className='px-4 py-2 rounded-full text-themeColDark dark:text-themeColLight border border-themeColDark dark:border-themeColLight' onClick={()=>setOpen(false)}>Cancel</button>
                            <button className='ml-4 bg-themeColDark dark:bg-themeColLight text-white px-4 py-2 rounded-full w-20' type="submit">Post</button>
                        </div>
                    </form>
                ) : (
                    <div className='flex items-center gap-4 ml-2' onClick={() => setOpen(true)}>
                        <div className='flex-shrink-0 aspect-square w-12 rounded-full overflow-hidden flex'>
                            <img
                                src={GetStaticImage(user.image, "?format=true&width=60&height=60") || "/profile.webp"}
                                alt={`${user.name}'s profile`}
                                className=" object-cover"
                            />
                        </div>
                        <p className='opacity-40'>Announce something to the group</p>
                    </div>
                )
            }

        </div>
    );
};

export default PostForm;
