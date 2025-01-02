import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const RequestView = () => {
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null);
    const { id } = useParams();


    const handleAccept = async () => {
        const apiDomain = import.meta.env.VITE_API_DOMAIN;
        const token = localStorage.getItem('authToken'); // Assuming the token is stored under 'authToken'

        if (!token) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        // Construct the URL for the request
        const url = `${apiDomain}/api/appointment/request/accept/${id}`;

        // Fetch data from API
        const fetchRequestData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to accept request');
                }

                const data = await response.json();
                setIsSuccess(data.data.message);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Trigger the data fetch
        fetchRequestData();
    }

    const handleReject = async () => {
        const apiDomain = import.meta.env.VITE_API_DOMAIN;
        const token = localStorage.getItem('authToken'); // Assuming the token is stored under 'authToken'

        if (!token) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        // Construct the URL for the request
        const url = `${apiDomain}/api/appointment/request/reject/${id}`;

        // Fetch data from API
        const fetchRequestData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to reject request');
                }

                const data = await response.json();
                setIsSuccess(data.message);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Trigger the data fetch
        fetchRequestData();
    }

    useEffect(() => {
        
        const apiDomain = import.meta.env.VITE_API_DOMAIN;
        const token = localStorage.getItem('authToken'); // Assuming the token is stored under 'authToken'

        if (!token) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        // Construct the URL for the request
        const url = `${apiDomain}/api/appointment/request/getrequestdetails/${id}`;

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
                    {
                        isSuccess && (
                            <div> {isSuccess} </div>
                        )
                    }
                    <div className='flex gap-3'>
                        <button className ="px-4 py-2 bg-themeColDark dark:bg-themeColLight rounded-md" onClick={handleReject}>Reject</button>
                        <button className ="px-4 py-2 bg-themeColDark dark:bg-themeColLight rounded-md" onClick={handleAccept}>Accept</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestView;
