import React, { useContext, useState } from 'react';
import { ThesisStreamContext } from '../../../../Contexts/ThesisStreamContext/ThesisStreamContext';

const PostList = () => {
    const { posts, socket } = useContext(ThesisStreamContext);
    const [newComment, setNewComment] = useState({});

    // Handle comment submission
    const handleCommentSubmit = (e, postId) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (newComment[postId]?.trim()) {
            socket.emit(
                'createComment',
                { roomId: posts[0]?.thesisId, commentData: { postId, content: newComment[postId], token } },
                (response) => {
                    if (response.success) {
                        setNewComment((prev) => ({ ...prev, [postId]: '' })); // Clear the comment input
                    } else {
                        console.error('Error creating comment:', response.message);
                    }
                }
            );
        }
    };

    // Handle input change for comments
    const handleCommentChange = (e, postId) => {
        const { value } = e.target;
        setNewComment((prev) => ({
            ...prev,
            [postId]: value,
        }));
    };

    return (
        <div className="post-list">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="post mb-5 p-4 border rounded-lg shadow">
                        <h3 className="font-bold text-lg">{post.title}</h3>
                        <p>{post.content}</p>
                        <div className="comments mt-4">
                            <h4 className="font-semibold">Comments</h4>
                            {post.comments?.length > 0 ? (
                                post.comments.map((comment) => (
                                    <div key={comment.id} className="comment p-2 border-b">
                                        <p>{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                            {/* Add Comment Form */}
                            <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mt-3">
                                <textarea
                                    placeholder="Add a comment"
                                    value={newComment[post.id] || ''}
                                    onChange={(e) => handleCommentChange(e, post.id)}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Comment
                                </button>
                            </form>
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available. Start by creating one!</p>
            )}
        </div>
    );
};

export default PostList;
