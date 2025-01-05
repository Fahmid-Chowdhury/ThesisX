import { useParams } from "react-router-dom";
import NotFound from "../../../Components/NotFound/NotFound";
import { useState } from 'react';
const PDFViewer = ({ pdfUrl }) => {

    return (
        <div className="h-full">
            <iframe
                className='w-full h-full'
                src={pdfUrl}
                title="PDF Viewer"
            />
        </div>
    );
};

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "user", text: input }]);

        // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "I'm here to help with your paper!" },
            ]);
        }, 500);

        setInput("");
    };

    return (
        <div>
            {/* Floating Button */}
            <div
                onClick={toggleChat}
                className="fixed bottom-5 right-5 h-12 w-12 flex items-center justify-center rounded-full shadow-lg cursor-pointer hover:rounded-2xl font-bold text-xl bg-[hsl(0,0,100)] dark:bg-black border border-[hsl(0,0,85)] dark:border-[hsl(0,0,15)]"
            >
                AI
            </div>

            {/* Chat Box */}
            {isOpen && (
                <div className="fixed bottom-20 right-5 max-w-96 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg max-h-[600px] flex flex-col transition-all ">
                    <div className= "p-3 flex items-center justify-between">
                        <h4 className="font-semibold">AI Assistant</h4>
                        <button
                            onClick={toggleChat}
                            className="text-white hover:text-gray-300"
                        >
                            ×
                        </button>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg ${msg.sender === "user"
                                        ? "bg-gray-200 dark:bg-gray-700 self-end"
                                        : "bg-blue-100 dark:bg-blue-700 self-start"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex p-2 border-t dark:border-gray-700">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PaperRead = () => {
    const { url } = useParams();
    const apiDomain = import.meta.env.VITE_API_DOMAIN;
    if (!url) return <NotFound />;

    return (
        <div className="max-w-7xl m-auto h-full relative">
            <PDFViewer pdfUrl={`${apiDomain}/api/public/document/${url}`} />
            <AIChat />
            
        </div>
    )
}

export default PaperRead