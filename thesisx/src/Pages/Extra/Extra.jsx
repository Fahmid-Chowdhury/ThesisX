import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const Extra = ({ facultyId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const localizer = momentLocalizer(moment);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch availability data from your API
                const apiDomain = import.meta.env.VITE_API_DOMAIN;
                const token = localStorage.getItem("authToken");
                const response = await fetch(`${apiDomain}/api/availability/get-availability`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // Add token for authentication
                    },
                    
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch availability data");
                }

                const data = await response.json();

                // Map availability data to events for the calendar
                const formattedEvents = data.data.map((availability) => ({
                    title: availability.type === "Online" ? "Available (Online)" : "Available (Offline)",
                    start: new Date(availability.startTime),
                    end: new Date(availability.endTime),
                    allDay: false,
                }));

                setEvents(formattedEvents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [facultyId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-500 text-lg">Loading schedule...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-center">Availability Schedule</h1>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                className="bg-white dark:bg-black shadow-md rounded-md"
            />
        </div>
    );
};

export default Extra;
