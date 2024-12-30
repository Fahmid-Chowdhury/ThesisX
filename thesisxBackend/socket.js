import jwt from 'jsonwebtoken'; // To verify the token
import DB from './DB/db.js'; // Import your DB connection or query functions

import axios from 'axios';

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle joining a room with a token verification
        socket.on('joinRoom', async ({ roomId, token, type }) => {
            let room = '';
            try {
                // Verify the token
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
                    thesis.faculty.userId === userId;

                if (!isAuthorized) {
                    throw new Error('Unauthorized: You are not allowed to join this room');
                }

                if (type === 'post') {
                    room = `thesis-post-${roomId}`;
                } else if (type === 'chat') {
                    room = `thesis-chat-${roomId}`;
                } else if (type === 'comment') {
                    room = `thesis-comment-${roomId}`;
                }


                // Join the room
                socket.join(room);
                console.log(`User ${socket.id} joined room: ${room}`);

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

                const user = await DB.user.findUnique({
                    where: { id: userId },
                    select: { image: true, name: true },
                });
                
                // Save the post to the database
                const newPost = await DB.post.create({
                    data: {
                        content: postData.content,
                        authorId: userId, // Use the user ID from the token
                        thesisId: parseInt(roomId),
                    },
                });

                newPost.author = user;

                // Broadcast the new post to everyone in the room
                io.to(`thesis-post-${roomId}`).emit('newPost', newPost);
                console.log(`Room ${`thesis-post-${roomId}`} members:`, Array.from(io.sockets.adapter.rooms.get(`thesis-post-${roomId}`) || []));

                // Acknowledge success
                callback({ success: true, post: newPost });
            } catch (error) {
                console.error('Error creating post:', error.message);
                callback({ success: false, message: error.message });
            }
        });

        socket.on('deleteComment', async ({roomId, commentId, token }) => {
            try {
                // Verify the token
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const userId = decoded.id;

                
                // Find the comment to ensure it exists and belongs to the user
                const comment = await DB.comment.findUnique({
                    where: { id: commentId },
                });
                console.log(comment)

                if (!comment) {
                    throw new Error('Comment not found');
                }

                if (comment.authorId !== userId) {
                    throw new Error('Unauthorized to delete this comment');
                }

                // Delete the comment from the database
                await DB.comment.delete({
                    where: { id: commentId },
                });

                console.log(roomId)
                // Optionally, you can broadcast the deletion to the room
                io.to(`thesis-post-${roomId}`).emit('commentDeleted', {postId:comment.postId, commentId });

                // Acknowledge success
                
            } catch (error) {
                console.error('Error deleting comment:', error.message);
            }
        });

        // Handle creating a new comment on a post
        socket.on('createComment', async ({ roomId, commentData, token }, callback) => {
            try {
                // Verify the token
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const userId = decoded.id;

                const user = await DB.user.findUnique({
                    where: { id: userId },
                    select: { image: true, name: true },
                });


                // Save the comment to the database
                const newComment = await DB.comment.create({
                    data: {
                        content: commentData.content,
                        postId: commentData.postId,
                        authorId: userId,
                    },
                });

                newComment.author = user;

                

                // Broadcast the new comment to everyone in the room
                io.to(`thesis-comment-${roomId}`).emit('newComment', {
                    postId: commentData.postId,
                    comment: newComment,
                });
                console.log(`Room ${roomId} members:`, Array.from(io.sockets.adapter.rooms.get(`thesis-comment-${roomId}`) || []));

                // Acknowledge success
                callback({ success: true, comment: newComment });
            } catch (error) {
                console.error('Error creating comment:', error.message);
                callback({ success: false, message: error.message });
            }
        });

        // // Handle chat messages
        // socket.on('chatWithAI', async ({ model, prompt, token }, callback) => {
        //     try {
        //         // Verify token and fetch user ID
        //         // const decoded = jwt.verify(token, process.env.JWT_KEY);
        //         // const userId = decoded.id;
        
        //         // Fetch or initialize conversation
        //         // let chat = await DB.chat.findUnique({
        //         //     where: { userId_model: { userId, model } },
        //         // });
        
        //         // if (!chat) {
        //         //     chat = await DB.chat.create({
        //         //         data: {
        //         //             userId,
        //         //             model,
        //         //             conversationHistory: [],
        //         //         },
        //         //     });
        //         // }
        
        //         // const conversationHistory = chat.conversationHistory || [];
                
        //         const conversationHistory = [];

        //         // Add user message to history
        //         const userMessage = { role: 'user', content: prompt };
        //         conversationHistory.push(userMessage);
        
        //         // Request AI response
        //         const aiResponse = await axios.post('http://localhost:11434/api/generate', {
        //             model : 'ThesisX',
        //             prompt: conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n'),
        //             stream: false,
        //         });
        
        //         const assistantMessage = { role: 'assistant', content: aiResponse.data.response };
        //         conversationHistory.push(assistantMessage);
        
        //         // // Update conversation history
        //         // await DB.chat.update({
        //         //     where: { id: chat.id },
        //         //     data: { conversationHistory },
        //         // });
        
        //         // Emit response to the user
        //         socket.emit('aiResponse', { response: assistantMessage.content });
        //         callback({ success: true, response: assistantMessage.content });
        //     } catch (error) {
        //         console.error('Error during AI chat:', error.message);
        //         callback({ success: false, error: error.message });
        //     }
        // });        
        

        // Handle user disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
}
