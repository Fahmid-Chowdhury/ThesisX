import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThesisStreamContext } from '../../../../Contexts/ThesisStreamContext/ThesisStreamContext';
import { AuthContext } from '../../../../Contexts/Authentication/AuthContext';
import { GetStaticImage } from '../../../../utils/imageAPI';
import { formatDate } from '../../../../utils/CommonUtility';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import UserClickOutside from '../../../../hooks/UseClickOutside';

const PostList = () => {
    const { posts, socket } = useContext(ThesisStreamContext);
    const { user } = useContext(AuthContext);

    return (
        <div className="post-list">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="bg-[hsl(0,0,100)] dark:bg-black mb-5 border border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)] rounded-lg ">
                        <div className='p-4 px-6'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='flex-shrink-0 aspect-square w-12 rounded-full overflow-hidden flex'>
                                    <img
                                        src={GetStaticImage(post.author.image, "?format=true&width=160&height=160") || "/profile.webp"}
                                        alt={`${post.author.name}'s profile`}
                                        className=" object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{post.author.name}</h4>
                                    <p className="text-sm text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">
                                        {formatDate(post.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <p className='font-light'>{post.content}</p>

                        </div>
                        <div className='h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2'></div>

                        <CommentSection comments={post.comments} postId={post.id} />

                    </div>
                ))
            ) : (
                <p>No posts available. Start by creating one!</p>
            )}
        </div>
    );
};


const CommentSection = ({ comments, postId }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div className='flex items-center px-6 mt-3 cursor-pointer mb-3' onClick={() => setExpanded(!expanded)}>
                {
                    comments?.length > 0 ? (
                        <p className='flex items-center gap-2'> <ChatBubbleLeftIcon className='w-5 h-5 mt-1' /> {comments.length} comments</p>
                    ) : (
                        <p>Add a comment</p>
                    )
                }
            </div>
            {expanded && (
                <div className='px-6 flex flex-col gap-2 mt-2'>
                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} />
                    ))}
                    <CommentPost postId={postId} />
                </div>
            )}
        </div>
    );
}

const Comment = ({ comment }) => {
    const { user } = useContext(AuthContext);
    const { socket } = useContext(ThesisStreamContext);

    const { id } = useParams();

    const handleDeleteComment = () => {
        const token = localStorage.getItem('authToken');
        socket.emit('deleteComment', {roomId:id, commentId: comment.id, token });
    };

    return (
        <div className='flex gap-2 mb-2'>
            <div className='flex-shrink-0 aspect-square w-8 h-8 rounded-full overflow-hidden flex mt-2'>
                <img
                    src={GetStaticImage(comment.author.image, "?format=true&width=160&height=160") || "/profile.webp"}
                    alt={`${comment.author.name}'s profile`}
                    className="object-cover"
                />
            </div>
            <div className='flex flex-col '>
                <div className="flex gap-2 items-center">
                    <h4>{comment.author.name}</h4>
                    <p className='text-sm text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]'>{formatDate(comment.createdAt)}</p>
                    {user.id === comment.authorId && (
                        <button onClick={handleDeleteComment}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                <p className='font-light'>{comment.content}</p>
            </div>
        </div>
    );
}

const CommentPost = ({postId}) => {
    const { user } = useContext(AuthContext);
    const { socket } = useContext(ThesisStreamContext);
    const [newComment, setNewComment] = useState("");

    const { id } = useParams();

    // Handle comment submission
    const handleCommentSubmit = (e, postId) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (newComment.trim()) {
            socket.emit(
                'createComment',
                { roomId: id, commentData: { postId, content: newComment.trim() }, token },
                (response) => {
                    if (response.success) {
                        setNewComment(""); // Clear the comment input
                    } else {
                        console.error('Error creating comment:', response.message);
                    }
                }
            );
            setNewComment("");
        }
    };
    const handleCommentChange = (e) => {
        const { value } = e.target;
        setNewComment(value);
    };
    return (
        <div>
            <div className='flex gap-4 mb-4'>
                <div className='flex-shrink-0 aspect-square w-8 h-8 rounded-full overflow-hidden flex'>
                    <img
                        src={GetStaticImage(user.image, "?format=true&width=160&height=160") || "/profile.webp"}
                        alt={`${user.name}'s profile`}
                        className=" object-cover"
                    />
                </div>
                <form onSubmit={(e) => handleCommentSubmit(e, postId)} className='w-full gap-2'>
                    <textarea
                        placeholder="Add a comment"
                        className="w-full border py-1 px-2 rounded-md bg-transparent border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)] dark:text-white outline-none"
                        onChange={(e) => handleCommentChange(e)}
                        value={newComment}
                        required
                    ></textarea>
                    <button type='submit' className='px-4 py-2 bg-themColDark dark:bg-themeColLight text-white rounded-full mt-2'>Comment</button>
                </form>
            </div>
        </div>
    );
}
export default PostList;
