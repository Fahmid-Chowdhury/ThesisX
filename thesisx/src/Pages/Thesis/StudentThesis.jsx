import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoResults from '../../assets/NoResults';

const StudentThesis = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchThesis = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const apiDomain = import.meta.env.VITE_API_DOMAIN;

                const response = await fetch(`${apiDomain}/api/thesis/get-thesis`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const error = await response.json();
                    setMessage(error.message || "Failed to fetch thesis data.");
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                if (data.success && data.thesisID) {
                    navigate(`/thesis/t/${data.thesisID}`);

                } else if (data.profileIncomplete) {
                    setMessage("Your student profile is incomplete. Please update your profile in Account Management.");
                } else {
                    // No thesis found, suggest creating or joining a thesis
                    setMessage("You are not enrolled in any thesis. Create or join a thesis to proceed.");
                }
            } catch (err) {
                console.error(err);
                setMessage("An error occurred while fetching your thesis data.");
            } finally {
                setLoading(false);
            }
        };

        fetchThesis();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 h-full flex flex-col items-center justify-center">
            <div className='mb-4 dark:opacity-50'>
                <NoResults height={"300"} width={"300"} />
            </div>
            <p className='text-center opacity-75'>{message}</p>
            {message.includes("Create or join a thesis") && (
                <div className="mt-4">
                    <button
                        className="px-4 py-2 rounded text-themeColDark dark:text-themeColLight border border-themeColDark dark:border-themeColLight"
                        onClick={() => navigate('/thesis/create')}
                    >
                        Create Thesis
                    </button>
                    <button
                        className="ml-4 bg-themeColDark dark:bg-themeColLight text-white px-4 py-2 rounded"
                        onClick={() => navigate('/thesis/join')}
                    >
                        Join Thesis
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentThesis;
