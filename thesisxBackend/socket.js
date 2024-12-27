import jwt from 'jsonwebtoken'; // To verify the token
import DB from './DB/db.js'; // Import your DB connection or query functions

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle joining a room with a token verification
        socket.on('joinRoom', async ({ roomId, token }) => {
            try {
                // Verify the token
                console.log('Token:', token);
                const decoded = jwt.verify(token, process.env.JWT_KEY); // Replace with your secret key
                const userId = decoded.id; // Assuming the user ID is stored in the token

                // Check if the user is associated with the room (thesis)
                const thesis = await DB.thesis.findUnique({
                    where: { id: parseInt(roomId) },
                    include: { student: true, faculty: true }, // Adjust based on your schema
                });

                // Ensure that the user is either a student or faculty member of the thesis
                const isAuthorized =
                    thesis.student.some((student) => student.userId === userId) ||
                    thesis.faculty.some((faculty) => faculty.userId === userId);

                if (!isAuthorized) {
                    throw new Error('Unauthorized: You are not allowed to join this room');
                }

                // Join the room
                socket.join(roomId);
                console.log(`User ${socket.id} joined room: ${roomId}`);

                // Optionally, you can send the user data or other info to the client
                socket.emit('roomJoined', { roomId, userId });
            } catch (error) {
                console.error('Error joining room:', error.message);
                socket.emit('joinRoomError', { message: error.message });
            }
        });

        // Handle creating a new post
        socket.on('createPost', async ({ roomId, postData, token }, callback) => {
            try {
                // Verify the token
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const userId = decoded.id;
                console.log('User ID:', userId);
                console.log('Room ID:', roomId);
                console.log('Post Data:', postData);
                // Save the post to the database
                const newPost = await DB.post.create({
                    data: {
                        title: postData.title,
                        content: postData.content,
                        authorId: userId, // Use the user ID from the token
                        thesisId: parseInt(roomId),
                    },
                });

                // Broadcast the new post to everyone in the room
                io.to(roomId).emit('newPost', newPost);

                // Acknowledge success
                callback({ success: true, post: newPost });
            } catch (error) {
                console.error('Error creating post:', error.message);
                callback({ success: false, message: error.message });
            }
        });

        // Handle creating a new comment on a post
        socket.on('createComment', async ({ roomId, commentData, token }, callback) => {
            try {
                // Verify the token
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const userId = decoded.id;

                console.log('User ID:', userId);
                console.log('Room ID:', roomId);
                console.log('Comment Data:', commentData);

                // Save the comment to the database
                const newComment = await DB.comment.create({
                    data: {
                        content: commentData.content,
                        postId: commentData.postId,
                        authorId: userId,
                    },
                });

                // Broadcast the new comment to everyone in the room
                io.to(roomId).emit('newComment', {
                    postId: commentData.postId,
                    comment: newComment,
                });

                // Acknowledge success
                callback({ success: true, comment: newComment });
            } catch (error) {
                console.error('Error creating comment:', error.message);
                callback({ success: false, message: error.message });
            }
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
}
