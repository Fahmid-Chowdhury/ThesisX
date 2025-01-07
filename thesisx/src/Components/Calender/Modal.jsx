import React from "react";

const Modal = ({ event, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{event.title}</h3>
                <p className="text-gray-600 mb-4">
                    <strong>Start:</strong> {event.start.toString()}
                </p>
                <p className="text-gray-600 mb-4">
                    <strong>End:</strong> {event.end.toString()}
                </p>
                <p className="text-gray-600 mb-4">
                    <strong>Type:</strong> {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
