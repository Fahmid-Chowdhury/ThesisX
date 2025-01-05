import { useParams } from "react-router-dom";
import NotFound from "../../../Components/NotFound/NotFound";
import { useState, useRef,useEffect } from 'react';
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
    const [showJumpButton, setShowJumpButton] = useState(false);
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { sender: "user", text: input }]);

        // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "I'm here to help with your paper!" },
            ]);
            scrollToBottom();
        }, 500);

        setInput("");
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (container) {
            const isScrolledToBottom =
                container.scrollHeight - container.scrollTop === container.clientHeight;
            setShowJumpButton(!isScrolledToBottom);
        }
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen, messages]);

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
                <div className="fixed bottom-20 right-5 max-w-[360px] w-full bg-[hsl(0,0,100)] dark:bg-black border border-[hsl(0,0,85)] dark:border-[hsl(0,0,15)] shadow-lg rounded-lg max-h-[500px] flex flex-col transition-all">
                    <div className="px-3 py-2 flex items-center justify-between">
                        <h4 className="">AI Assistant</h4>
                        <button onClick={toggleChat} className="text-2xl">
                            ×
                        </button>
                    </div>
                    <div
                        ref={chatContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 p-3 overflow-y-auto space-y-2 border-t dark:border-gray-700 relative"
                    >
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
                        <div ref={chatEndRef} />
                    </div>
                    {showJumpButton && (
                        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2">
                            <button
                                onClick={scrollToBottom}
                                className="px-3 py-1 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
                            >
                                Jump to Present
                            </button>
                        </div>
                    )}
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