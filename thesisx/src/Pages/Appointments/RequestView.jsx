import { GetStaticImage } from '../../utils/imageAPI';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const RequestView = () => {
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate()
    const token = localStorage.getItem('authToken');

    const decoded = jwtDecode(token);
    console.log(decoded);


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
        <div className='max-w-7xl p-2 sm:p-5 mx-auto'>
            <h1 className='text-3xl font-bold'>Request Details</h1>
            {requestData && (
                <div>
                    <h1 className="text-xl sm:text-2xl text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] font-semibold mt-3 mb-3 ">
                        Title: {requestData.thesis.title}
                    </h1>
                    <div className='h-[1px] w-full bg-[hsl(0,0,80)] dark:bg-[hsl(0,0,20)]'></div>
                    <p className="mt-2 ">
                        Abstract:
                    </p>
                    <p className="text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] mt-2 flex text-sm sm:text-base">
                        {requestData.thesis.abstract ? requestData.thesis.abstract : (
                            <span className='text-center text-[hsl(0,0,50%)] dark:text-[hsl(0,0,50%)] w-full italic'>
                                No abstract available
                            </span>

                        )}
                    </p>

                    <div className='h-[1px] w-full bg-[hsl(0,0,80)] dark:bg-[hsl(0,0,20)] mt-3'></div>

                    <h3 className='mt-2'>Students:</h3>
                    <div className='flex flex-col gap-4 mt-4'>
                        {requestData.thesis.student.map(student => (
                            <div className="flex items-center gap-2 bg-[hsl(0,0,100)] dark:bg-black p-4 border border-[hsl(0,0,85)] dark:border-[hsl(0,0,15)] rounded-lg cursor-pointer" onClick={()=>{navigate(`student/${student.user.id}`)}} key={student.id}>
                                <div className='flex-shrink-0 aspect-square w-12 rounded-full overflow-hidden flex'>
                                    <img
                                        src={GetStaticImage(student.user.image, "?format=true&width=160&height=160") || "/profile.webp"}
                                        alt={`${student.user.name}'s profile`}
                                        className=" object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{student.user.name}</h3>
                                    <p className="text-sm text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">{student.user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='h-[1px] w-full bg-[hsl(0,0,80)] dark:bg-[hsl(0,0,20)] mt-3'></div>
                    <h3 className='mt-2'>Notes: </h3>

                    <p className="text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] mt-2 flex text-sm sm:text-base ">
                        {requestData.notes? requestData.notes : (
                            <span className='text-center text-[hsl(0,0,50%)] dark:text-[hsl(0,0,50%)] w-full italic'>
                                No Notes provided
                            </span>

                        )}
                    </p>

                    {
                        decoded.role === 'FACULTY' && (
                            <>
                                {
                                    isSuccess && (
                                        <div className='mt-3 text-green-500'> {isSuccess} </div>
                                    )
                                }
                                {
                                    requestData.status === 'PENDING' && (
                                        <div className='flex items-center justify-center mt-3 gap-3'>
                                            <button className="px-4 py-2 bg-themeColDark dark:bg-themeColLight rounded-md" onClick={handleReject}>Reject</button>
                                            <button className="px-4 py-2 bg-themeColDark dark:bg-themeColLight rounded-md" onClick={handleAccept}>Accept</button>
                                        </div>
                                    )
                                }
                            </>

                        )
                    }
                </div>
            )}
        </div>
    );
};

export default RequestView;
