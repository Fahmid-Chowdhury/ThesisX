import { useState, useEffect } from "react";
import BarLoader from "react-spinners/BarLoader";
import UploadImage from "./UploadImage";
import BasicInfoUpdate from "./GeneralUpdate";
import ResearchAndPublications from "./ResearchAndPublicationUpdate";
const AccountManagement = () => {
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

                const response = await fetch(`${apiDomain}/api/user/getprofile`, {
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

    if (loading) return (
        <div className='h-full w-full bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] flex flex-col items-center justify-center'>
            <BarLoader
                color={'hsl(210 80% 55%)'}
                height={'6px'}
                width={'150px'}
            />
            <p className="mt-2">
                Loading...
            </p>
        </div>

    );
    if (error) return (
        <>
            <div className="h-full w-full bg-[hsl(0,0%,95%)] dark:bg-[hsl(0,0%,5%)] flex flex-col items-center justify-center">
                <div className="max-w-xs bg-white dark:bg-black p-5 rounded-md ">
                    <h2 className="text-[hsl(2,73%,53%)] font-bold text-3xl text-center">Error:</h2>
                    <p className="font-light text-xl opacity-60 text-center mt-2">
                        {error}
                    </p>
                </div>
            </div>
        </>
    );
    return (
        <div className="max-w-7xl mx-auto p-5 space-y-5">
            <div className="h-7 md:h-0"></div>
            <UploadImage userData={userData} setUserData={setUserData}/>
            <BasicInfoUpdate userData={userData} setUserData={setUserData} />
            <ResearchAndPublications userData={userData} setUserData={setUserData} />
        </div>
    )
}

export default AccountManagement
