import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEventForm from "./AddEventForm"; // Import AddEventForm for event creation
import Modal from "./Modal"; // The Modal to show event details
import { jwtDecode } from "jwt-decode";
// Configure the calendar to use Moment.js
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token)
    // Fetch or mock data for events
    useEffect(() => {
        // Example events

        fetchAvailability(); // Fetch availability from API
    }, []);

    const fetchAvailability = async () => {
        try{
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            const response = await fetch(`${apiDomain}/api/availability/get-availability`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch availability");
            }

            const data = await response.json();
            const events = data.data;

            const updatedEvents = events.map(event => {
                const startDate = new Date(event.startTime);
                const endDate = new Date(event.endTime);
            
                return {
                    title: "Available "+event.type,  // Set title as the type
                    start: startDate,   // Convert startTime to Date object
                    end: endDate,       // Convert endTime to Date object
                    type: "available",  // Set type as "available" (you can adjust based on the logic needed)
                };
            });

            console.log(updatedEvents);
            setEvents(updatedEvents); // Update the state with the fetched events

         
        } catch (err) {
            console.error("Error fetching availability:", err.message);
        }
    }

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

    const addAvailabililty = async (event) => {
        try{
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/availability/add-availability`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: event.type,
                    startTime: event.start,
                    endTime: event.end,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add availability");
            }

            const data = await response.json();
            console.log(data);
            fetchAvailability(); // Fetch updated availability after adding new event
        } catch (err) {
            console.error("Error adding availability:", err.message);
        } 
    }


    const handleEventSave = (newEvent) => {
        if (decoded.role === 'FACULTY'){
            addAvailabililty(newEvent);
            closeAddEventModal
            return
        }
        console.log(newEvent);
        // setEvents([...events, newEvent]);
        // closeAddEventModal();
    };

    return (
        <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Event Scheduler</h1>
                <button
                    onClick={handleAddEventClick}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                    {
                        decoded.role === "STUDENT" ? 'Add Appointment' : 'Add Availability'
                    }
                    
                </button>
            </div>


            <div className="calendar-container bg-[hsl(0,0,100)] dark:bg-black border border-[hsl(0,0,85)] dark:border-[hsl(0,0,15)] rounded-lg shadow-lg p-4">
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
                            case "appointment":
                                backgroundColor = "#4C6B8A"; // Blue for meetings
                                break;
                            case "available":
                                backgroundColor = "#F2994A"; // Orange for discussions
                                break;
                            default:
                                backgroundColor = "#6C757D"; // Gray for others
                        }
                        return { style: { backgroundColor, borderRadius: "8px", color:"white" } };
                    }}
                />
            </div>

            {/* Add Event Modal */}
            {isAddEventOpen && (
                <AddEventForm onSave={handleEventSave} onClose={closeAddEventModal} currentTimes={events} />
            )}

            {/* Event Details Modal */}
            {isModalOpen && selectedEvent && (
                <Modal event={selectedEvent} onClose={closeModal} />
            )}
        </div>
    );
};

export default CalendarComponent;
