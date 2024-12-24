import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";

const Extra = ({ facultyId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiDomain = import.meta.env.VITE_API_DOMAIN;
                const token = localStorage.getItem("authToken");
                const response = await fetch(`${apiDomain}/api/availability/get-availability`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch availability data");
                }

                const data = await response.json();

                // Format the data for Scheduler
                const formattedEvents = data.data.map((availability) => ({
                    event_id: availability.id, // Ensure a unique ID exists
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

    const handleEventUpdate = async (updatedEvent) => {
        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${apiDomain}/api/availability/update-availability`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    availabilityId: updatedEvent.event_id, // Event ID from the backend
                    startTime: updatedEvent.start.toISOString(), // Convert to ISO string
                    endTime: updatedEvent.end.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update availability");
            }

            const data = await response.json();
            console.log("Availability updated successfully:", data);
        } catch (err) {
            console.error("Error updating availability:", err);
            alert("Failed to update availability.");
        }
    };

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
            <Scheduler
                view="month" // Default view
                events={events}
                onEventChange={(updatedEvent) => {
                    // Update events in state
                    setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.event_id === updatedEvent.event_id ? updatedEvent : event
                        )
                    );

                    // Call API to update in the backend
                    handleEventUpdate(updatedEvent);
                }}
                editable={true} // Disable editing if not needed
                deletable={true} // Disable deleting events
                draggable={true} // Disable drag-and-drop
            />
        </div>
    );
};

export default Extra;
