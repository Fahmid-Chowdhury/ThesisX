import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // Replace with your server URL

const token = "your_valid_jwt_token"; // Replace with a valid JWT token
const thesisId = 1; // Replace with an existing thesis ID
const question = "Explain the methodology section.";

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);

    socket.emit(
        "chatWithAI",
        { thesisId, question, token },
        (response) => {
            console.log("Server Response:", response); // Debugging: Log the full response
            if (response.success) {
                console.log("AI Response:", response.response); // Correct access
            } else {
                console.error("Error:", response.error || "Unknown error");
            }
            socket.disconnect();
        }
    );
});

socket.on("aiResponse", (data) => {
    console.log("Real-time AI Response:", data);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});