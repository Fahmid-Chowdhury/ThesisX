import { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import NotFound from '../../../Components/NotFound/NotFound';
import LoaderSVG from '../../../assets/LoaderSVG';
import { GetStaticImage } from '../../../utils/imageAPI';
import { AuthContext } from '../../../Contexts/Authentication/AuthContext';
import { formatDate } from '../../../utils/CommonUtility';

const SupervisorProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState(null);
    const [request, setRequest] = useState(false);
    const [success, setSuccess] = useState(null);
    const [submissionLoading, setSubmissionLoading] = useState(false);

    const { thesis, setRefresh, user } = useContext(AuthContext);

    const handleRequestSupervision = async () => {
        try {
            setSubmissionLoading(true);
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            const response = await fetch(`${apiDomain}/api/faculty/request-supervision`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ facultyID: id, thesisID: thesis.data.id, notes: comment }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setSuccess(data.data);
            setMessage(null)
            

            console.log("Request for supervision sent:", data);
        } catch (err) {
            console.error("Failed to send request for supervision:", err.message);
            setMessage(err.message);
        } finally {
            setSubmissionLoading(false);
        }
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch user profile data from API
                const apiDomain = import.meta.env.VITE_API_DOMAIN;
                const token = localStorage.getItem("authToken"); // Retrieve token from local storage

                if (!token) {
                    throw new Error("User not authenticated. Token not found.");
                }

                const response = await fetch(`${apiDomain}/api/faculty/facultyinfo?id=${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Add token to Authorization header
                    },
                });

                const result = await response.json();

                if (result.success) {
                    setUserData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch profile data.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };


        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <LoaderSVG color={"CornflowerBlue"} />
                <p className='mt-3'>Loading...</p>
            </div>
        );
    }

    if (error || !userData) {
        return <NotFound redirect={"/"} redirectName={"Go back to Home page"} />;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-[hsl(240,10%,20%)] dark:text-[hsl(240,10%,80%)] font-bold text-3xl mb-4">Faculty Profile</h1>

            <div className="flex items-start gap-4 sm:flex-row flex-col">

                <div className="  flex flex-col max-h-max w-full sm:max-w-80 gap-4">
                    <div className="flex flex-col w-full bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,10%)] p-5 rounded-lg">
                        <div className="w-full flex flex-col items-center">

                            <div className="aspect-square w-40 rounded-full overflow-hidden flex">
                                <img
                                    src={GetStaticImage(userData.image, "?format=true&width=160&height=160") || "profile.webp"}
                                    alt={`${userData.name}'s profile`}
                                    className=" object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-3 text-center">
                            <h2 className="text-black dark:text-white text-2xl font-semibold">{userData.name}</h2>
                            <p className="text-[hsl(0,0%,50%)] capitalize">{userData.role}</p>
                            <p className="text-[hsl(0,0%,50%)] capitalize">dept. {userData.department}</p>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="flex flex-col items-center opacity-60">
                                <span>Email</span>
                                {userData.email}
                            </p>
                        </div>
                    </div>
                    {
                        message && (
                            <div className="p-4 bg-[hsl(0,90%,95%)] dark:bg-[hsl(0,90%,5%)] border border-[hsl(0,80%,70%)] dark:border-[hsl(0,80%,30%)] rounded-lg">
                                <p className='text-[hsl(0,70%,30%)] dark:text-[hsl(0,70%,70%)]'>
                                    {message}
                                </p>

                            </div>
                        )
                    }
                    {
                        thesis && (
                            !thesis.data.faculty && (
                                <>
                                    {
                                        !request && (
                                            <button className="bg-themeColDark dark:bg-themeColLight text-white py-2 px-4 rounded-md w-full" onClick={() => setRequest(true)}>
                                                {request ? "Cancel" : "Request Supervision"}
                                            </button>
                                        )
                                    }
                                    {
                                        request && (
                                            <div className="p-4 bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] border border-[hsl(0,0%,70%)] dark:border-[hsl(0,0%,30%)] rounded-lg">
                                                
                                                <p className='text-[hsl(0,0%,30%)] dark:text-[hsl(0,0%,70%)]'>
                                                    Are you sure you want to request supervision from <span className='font-bold'>{userData.name}</span>?
                                                </p>
                                                {/* comment form */}
                                                <div className="mt-4">
                                                    <textarea
                                                        id="comment"
                                                        className="w-full p-2 border border-[hsl(0,0%,70%)] dark:border-[hsl(0,0%,30%)] bg-transparent rounded-md outline-none focus:outline-themeColDark dark:focus:outline-themeColLight"
                                                        placeholder="Add a comment for the faculty"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    ></textarea>
                                                </div>
                                                <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2"></div>
                                    
                                                <div className="flex gap-4 mt-4">
                                                    {submissionLoading ? (
                                                        <div className="flex items-center gap-2">
                                                            <LoaderSVG color={"CornflowerBlue"} />
                                                            <span className="text-[hsl(0,0%,30%)] dark:text-[hsl(0,0%,70%)]">Sending request...</span>
                                                        </div>
                                                    ):(
                                                        success ? (
                                                            <div className="">
                                                                <p className='text-xl'>
                                                                    Request sent successfully
                                                                </p>
                                                                <div className='mt-2'>
                                                                    <p>Request status {success.status}</p>
                                                                    <p>Request created { formatDate(success.createdAt)}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <button className="bg-themeColDark dark:bg-themeColLight text-white py-2 px-4 rounded-md w-full" disabled={submissionLoading} onClick={handleRequestSupervision}>
                                                                    Confirm
                                                                </button>
                                                                <button className="bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,10%)] text-[hsl(0,0%,30%)] dark:text-[hsl(0,0%,70%)] py-2 px-4 rounded-md w-full" onClick={() => setRequest(false)} disabled={submissionLoading}>
                                                                    Cancel
                                                                </button>
                                                            </>

                                                        )

                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                </>

                            )
                        )
                    }

                </div>

                <div className="bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,10%)] p-5 rounded-lg flex flex-col w-full">
                    <h3 className="text-xl font-semibold">
                        Faculty Details
                    </h3>
                    <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2"></div>
                    <div className="mt-3">
                        <p className="text-lg font-semibold">
                            Research Interests
                        </p>
                        <div className="mt-2">
                            {userData.faculty.researchInterests?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {userData.faculty.researchInterests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="bg-themeColDark dark:bg-themeColLight text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className=" italic font-light  opacity-30">
                                    No tags added
                                </div>
                            )}

                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-lg font-semibold">
                            Contributions
                        </p>
                        <div className="mt-2 ">
                            {userData.faculty.publications?.length ? (
                                <div className="flex flex-col gap-3" >
                                    {userData.faculty.publications.map((contribution) => (
                                        <div key={contribution.id} className="bg-[hsl(0,0,85)] dark:bg-[hsl(0,0,15)] p-3 border dark:border-[hsl(0,0,20%)] border-[hsl(0,0,80%)] rounded-md">
                                            <div className="text-xl font-medium">
                                                {contribution.title}
                                            </div>
                                            <div className="opacity-50">
                                                Authors: <span className="italic font-light">{contribution.authors.join(", ")}</span>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="opacity-50">
                                                    Published at: {new Date(contribution.publicationDate).toLocaleDateString()}
                                                </div>
                                                <a href={contribution.url} className=" text-white py-1 px-2 bg-themeColDark dark:bg-themeColLight block w-max rounded-md">Visit Paper</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className=" italic font-light  opacity-30">
                                    No contributions listed
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SupervisorProfile