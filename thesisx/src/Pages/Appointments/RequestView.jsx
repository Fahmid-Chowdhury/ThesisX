import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RequestView = () => {
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiDomain = import.meta.env.VITE_API_DOMAIN;
        const token = localStorage.getItem('authToken'); // Assuming the token is stored under 'authToken'

        if (!token) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        // Construct the URL for the request
        const requestId = 1; // You may want to pass this as a prop or use a router parameter
        const url = `${apiDomain}/api/appointment/request/getrequestdetails/${requestId}`;

        // Fetch data from API
        const fetchRequestData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch request data');
                }

                const data = await response.json();
                setRequestData(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Trigger the data fetch
        fetchRequestData();
    }, []); // Empty dependency array means this will run once on mount

    // Render loading, error, or data state
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // If request data is fetched successfully
    return (
        <div>
            <h1>Request Details</h1>
            {requestData && (
                <div>
                    <h2>Thesis Title: {requestData.thesis.title}</h2>

                    <h3>Students:</h3>
                    <ul>
                        {requestData.thesis.student.map(student => (
                            <li key={student.id}>
                                <Link to={`student/${student.user.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                                    {student.user.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RequestView;
