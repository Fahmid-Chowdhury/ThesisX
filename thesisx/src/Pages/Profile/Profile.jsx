import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import { GetStaticImage } from "../../utils/imageAPI";

const Profile = () => {
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

    const {
        name,
        email,
        department,
        role,
        bio,
        verified,
        createdAt,
        image,
        facultyDetails,
        studentDetails,
    } = userData;

    const isProfileIncomplete =
        !bio ||
        (role === "FACULTY" && (!facultyDetails || !facultyDetails.researchInterests)) ||
        (role === "STUDENT" && (!studentDetails || !studentDetails.researchInterests));

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-[hsl(240,10%,20%)] dark:text-[hsl(240,10%,80%)] font-bold text-3xl mb-4">My Profile</h1>

            {isProfileIncomplete && (
                <div className="mb-6 p-4 bg-[hsl(50,90%,95%)] dark:bg-[hsl(50,90%,5%)] border border-[hsl(50,80%,70%)] dark:border-[hsl(50,80%,30%)] rounded-lg">
                    <p className="text-[hsl(50,70%,30%)] dark:text-[hsl(50,70%,70%)]">
                        Your profile is incomplete. Please{" "}
                        <a href="/accountmanagement" className="underline text-themeColDark dark:text-themeColLight">
                            set up your profile
                        </a>{" "}
                        to ensure all features are accessible.
                    </p>
                </div>
            )}

            <div className="flex items-start gap-4 sm:flex-row flex-col">

                <div className="bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,10%)] p-5 rounded-lg flex max-h-max w-full sm:max-w-80">
                    <div className="flex flex-col w-full">
                        <div className="w-full flex flex-col items-center">

                            <div className="aspect-square w-40 rounded-full overflow-hidden flex">

                                <img
                                    src={GetStaticImage(image,"?format=true&width=160&height=160") || "profile.webp"}
                                    alt={`${name}'s profile`}
                                    className=" object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-3 text-center">
                            <h2 className="text-black dark:text-white text-2xl font-semibold">{name}</h2>
                            <p className="text-[hsl(0,0%,50%)] capitalize">{role}</p>
                            <p className="text-[hsl(0,0%,50%)] capitalize">dept. {department}</p>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="flex flex-col items-center opacity-60">
                                <span>Email</span>
                                {email}
                            </p>

                            <p className="text-[hsl(0,0%,50%)]">
                                Joined: {new Date(createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        

                    </div>


                </div>
                {role === "FACULTY" && facultyDetails && (
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
                                {facultyDetails.researchInterests?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {facultyDetails.researchInterests.map((interest, index) => (
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
                                {facultyDetails.publications?.length ? (
                                    <div className="flex flex-col gap-3" >
                                        {facultyDetails.publications.map((contribution) => (
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
                )}

                {role === "STUDENT" && studentDetails && (
                    <div className="bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,10%)] p-5 rounded-lg flex flex-col w-full">
                        <h3 className="text-xl font-semibold">
                            Student Details
                        </h3>
                        <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2"></div>
                        <div className="mt-3">
                            <p className="text-lg font-semibold">
                                Research Interests
                            </p>
                            <div className="mt-2">
                                {studentDetails.researchInterests?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {studentDetails.researchInterests.map((interest, index) => (
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
                                {studentDetails.contributions?.length ? (
                                    <div className="flex flex-col gap-3" >
                                        {studentDetails.contributions.map((contribution) => (
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
                )}
            </div>
        </div>
    );
};

export default Profile;
