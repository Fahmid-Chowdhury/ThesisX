import { useState, useEffect } from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react"
import '@schedule-x/theme-default/dist/index.css'
import {
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'

const Extra = ({ facultyId }) => {
    const [event, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        events: event
    })


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
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
};

export default Extra;
