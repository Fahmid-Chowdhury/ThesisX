import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AddEventForm = ({ onSave, onClose, currentTimes }) => {
    const [start, setStart] = useState(new Date().toISOString());
    const [end, setEnd] = useState(new Date().toISOString());  // Manage end time in state
    const [type, setType] = useState("online");
    const [note, setNote] = useState("");
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);


    useEffect(() => {
        if (decoded.role === "STUDENT") {
            // Set the end time for students to be 20 minutes after start time
            const studentEndTime = new Date(start);
            studentEndTime.setMinutes(studentEndTime.getMinutes() + 20); // Add 1 hour
            setEnd(studentEndTime.toISOString());
        }
    }, [start, decoded.role]);

    const convertToUTCIso = (isoString) =>{
        const localDate = new Date(isoString); // Parse ISO as local
        return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000).toISOString(); // Adjust to UTC
    }
    const isConflict = (startISO, endISO) => {
        const now = new Date();
        
        // Convert local ISO to UTC for consistent comparison
        const convertToUTC = (isoString) => {
            const localDate = new Date(isoString); // Parse ISO as local
            return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000); // Adjust to UTC
        };
    
        const startUTC = convertToUTC(startISO);
        const endUTC = convertToUTC(endISO);
        const nowUTC = new Date(now.getTime());

        console.log(startUTC, endUTC, nowUTC);
    
        // Ensure the start time is in the future (in UTC)
        if (startUTC <= nowUTC) {
            alert("The start time must be in the future.");
            return true;
        }
    
        if (decoded.role === "FACULTY") {
            // Check conflicts with faculty availability
            for (const event of currentTimes) {
                if (event.type === "available") {
                    const eventStartUTC = event.start;
                    const eventEndUTC = event.end;
                    if (
                        (startUTC >= eventStartUTC && startUTC < eventEndUTC) || // Overlap with start
                        (endUTC > eventStartUTC && endUTC <= eventEndUTC) ||    // Overlap with end
                        (startUTC <= eventStartUTC && endUTC >= eventEndUTC)    // Encloses existing time
                    ) {
                        alert("The selected time conflicts with your existing availability.");
                        return true;
                    }
                }
            }
        } else if (decoded.role === "STUDENT") {
            // Ensure the appointment falls within available faculty times
            const isInRange = currentTimes.some((event) => {
                if (event.type === "available") {
                    const eventStartUTC = event.start;
                    const eventEndUTC = event.end;
                    return startUTC >= eventStartUTC && endUTC <= eventEndUTC;
                }
                return false;
            });
    
            if (!isInRange) {
                alert("The selected time is outside the available time slots.");
                return true;
            }
        }
    
        return false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Use `end` from state here to avoid hardcoded calculation
        if (isConflict(start, end)) return;

        const newEvent =
            decoded.role === "FACULTY"
                ? { type, start: convertToUTCIso(start), end:convertToUTCIso(end) }
                : { appointmentTime: convertToUTCIso(start), note };

        onSave(newEvent);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="text-xl font-semibold">
                        {decoded.role === "STUDENT" ? "Add Appointment" : "Add Availability"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="mb-4">
                        <label htmlFor="start" className="block text-gray-700">
                            {decoded.role === "STUDENT" ? "Appointment Time" : "Start Time"}
                        </label>
                        <input
                            type="datetime-local"
                            id="start"
                            value={start.slice(0, 16)}
                            onChange={(e) => setStart(e.target.value + ":00.000Z")}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {decoded.role === "STUDENT" && (
                        <div className="mb-4">
                            <label htmlFor="end" className="block text-gray-700">
                                End Time (Automatically Calculated)
                            </label>
                            <input
                                type="datetime-local"
                                id="end"
                                value={end.slice(0, 16)}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
                                readOnly
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Note: Appointment length is always 20 minutes.
                            </p>
                        </div>
                    )}

                    {decoded.role === "FACULTY" && (
                        <div className="mb-4">
                            <label htmlFor="end" className="block text-gray-700">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                id="end"
                                value={end.slice(0, 16)}
                                onChange={(e) => setEnd(e.target.value + ":00.000Z")}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    )}

                    {decoded.role === "FACULTY" && (
                        <div className="mb-4">
                            <label htmlFor="type" className="block text-gray-700">
                                Type
                            </label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                    )}

                    {decoded.role === "STUDENT" && (
                        <div className="mb-4">
                            <label htmlFor="note" className="block text-gray-700">
                                Notes
                            </label>
                            <textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                rows="3"
                                placeholder="Add any additional notes or information"
                            ></textarea>
                        </div>
                    )}

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
                            Save {decoded.role === "STUDENT" ? "Appointment" : "Availability"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventForm;
