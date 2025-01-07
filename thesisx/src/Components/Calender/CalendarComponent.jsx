import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEventForm from "./AddEventForm"; // Import AddEventForm for event creation
import Modal from "./Modal"; // The Modal to show event details

// Configure the calendar to use Moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);

    // Fetch or mock data for events
    useEffect(() => {
        // Example events
        setEvents([
            {
                title: "Faculty Meeting",
                start: new Date(2025, 0, 10, 10, 0),
                end: new Date(2025, 0, 10, 12, 0),
                type: "meeting",
            },
            {
                title: "Student Thesis Discussion",
                start: new Date(2025, 0, 12, 14, 0),
                end: new Date(2025, 0, 12, 16, 0),
                type: "discussion",
            },
        ]);
    }, []);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleAddEventClick = () => {
        setIsAddEventOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeAddEventModal = () => {
        setIsAddEventOpen(false);
    };

    const handleEventSave = (newEvent) => {
        setEvents([...events, newEvent]);
        closeAddEventModal();
    };

    return (
        <div className="h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Event Scheduler</h1>
                <button
                    onClick={handleAddEventClick}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                    Add Event
                </button>
            </div>


            <div className="calendar-container bg-white rounded-lg shadow-lg p-4">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    views={{
                        month: true,
                        week: true,
                        day: true,
                        agenda: true,
                        // timelineDay: true,
                        // timelineWeek: true,
                        // timelineMonth: true,
                    }}
                    step={30}
                    timeslots={2}
                    defaultView="month"
                    onSelectEvent={handleEventClick}
                    eventPropGetter={(event) => {
                        // Customize event styles based on type (for color coding)
                        let backgroundColor = "";
                        switch (event.type) {
                            case "meeting":
                                backgroundColor = "#4C6B8A"; // Blue for meetings
                                break;
                            case "discussion":
                                backgroundColor = "#F2994A"; // Orange for discussions
                                break;
                            default:
                                backgroundColor = "#6C757D"; // Gray for others
                        }
                        return { style: { backgroundColor, borderRadius: "8px" } };
                    }}
                />
            </div>

            {/* Add Event Modal */}
            {isAddEventOpen && (
                <AddEventForm onSave={handleEventSave} onClose={closeAddEventModal} />
            )}

            {/* Event Details Modal */}
            {isModalOpen && selectedEvent && (
                <Modal event={selectedEvent} onClose={closeModal} />
            )}
        </div>
    );
};

export default CalendarComponent;
