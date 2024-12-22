import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import NotFound from '../../../Components/NotFound/NotFound';
import LoaderSVG from '../../../assets/LoaderSVG';
import { GetStaticImage } from '../../../utils/imageAPI';

const SupervisorProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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
                                    src={GetStaticImage(userData.image,"?format=true&width=160&height=160") || "profile.webp"}
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
                    <div className="flex flex-col w-full bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,10%)] p-5 rounded-lg">
                        items
                    </div>
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