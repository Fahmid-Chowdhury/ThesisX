import { createContext, useContext, useState, useEffect } from "react";

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${apiDomain}/api/appointment/getappointments`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch appointments.");
            }

            const data = await response.json();
            setAppointments(data.data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Fetch requests
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${apiDomain}/api/appointment/getrequests`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch requests.");
            }

            const data = await response.json();
            setRequests(data.data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        const initialize = async () => {
            await Promise.all([fetchAppointments(), fetchRequests()]);
        };
        initialize();
        setLoading(false)
    }, []);

    return (
        <AppointmentContext.Provider value={{ appointments, requests, fetchAppointments, fetchRequests, loading, error }}>
            {children}
        </AppointmentContext.Provider>
    );
};

// Custom hook to use Appointment context
export const useAppointment = () => {
    return useContext(AppointmentContext);
};
