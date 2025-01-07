import React, { useState } from "react";

const AddEventForm = ({ onSave, onClose }) => {
    const [title, setTitle] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [type, setType] = useState("meeting");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create the new event object
        const newEvent = {
            title,
            start,
            end,
            type,
        };

        // Call the onSave function to add the event
        onSave(newEvent);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="text-xl font-semibold">Add New Event</h2>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700">
                            Event Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="start" className="block text-gray-700">
                            Start Time
                        </label>
                        <input
                            type="datetime-local"
                            id="start"
                            value={start.toISOString().slice(0, 16)}
                            onChange={(e) => setStart(new Date(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="end" className="block text-gray-700">
                            End Time
                        </label>
                        <input
                            type="datetime-local"
                            id="end"
                            value={end.toISOString().slice(0, 16)}
                            onChange={(e) => setEnd(new Date(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="type" className="block text-gray-700">
                            Event Type
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                            <option value="meeting">Meeting</option>
                            <option value="discussion">Discussion</option>
                            <option value="lecture">Lecture</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-4"
                        >
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventForm;
