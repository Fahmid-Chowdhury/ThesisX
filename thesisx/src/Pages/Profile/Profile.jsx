import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error}</p>;

    const { name, email, department, role, bio, verified, createdAt, image, facultyDetails } = userData;

    const isProfileIncomplete =
        !bio || (role === "FACULTY" && (!facultyDetails || !facultyDetails.researchInterests));

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>

            {isProfileIncomplete && (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="text-yellow-700">
                        Your profile is incomplete. Please{" "}
                        <Link to="/accountmanagement" className="underline text-blue-600">
                            set up your profile
                        </Link>{" "}
                        to ensure all features are accessible.
                    </p>
                </div>
            )}

            <div className="bg-white p-6 rounded shadow">
                <div className="flex items-center space-x-4">
                    
                    <img
                        src={image || "profile.webp"}
                        alt={`${name}'s profile`}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    

                    <div>
                        <h2 className="text-2xl font-semibold">{name}</h2>
                        <p className="text-gray-500">{email}</p>
                        <p className="text-gray-500">Department: {department || "N/A"}</p>
                        <p className="text-gray-500">Role: {role}</p>
                        <p className="text-gray-500">Verified: {verified ? "Yes" : "No"}</p>
                        <p className="text-gray-500">Joined: {new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {role === "FACULTY" && facultyDetails && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold">Faculty Details</h3>
                        <p className="text-gray-700">
                            Research Interests:{" "}
                            {facultyDetails.researchInterests?.join(", ") || "Not provided"}
                        </p>

                        <h4 className="text-lg font-semibold mt-4">Publications</h4>
                        {facultyDetails.publications?.length ? (
                            <ul className="list-disc list-inside text-gray-700">
                                {facultyDetails.publications.map((pub) => (
                                    <li key={pub.id}>
                                        <a
                                            href={pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {pub.title}
                                        </a>{" "}
                                        - {pub.authors.join(", ")}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No publications listed.</p>
                        )}
                    </div>
                )}

                {role === "STUDENT" && facultyDetails && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold">Student Details</h3>
                        <p className="text-gray-700">
                            Research Interests:{" "}
                            {facultyDetails.researchInterests?.join(", ") || "Not provided"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
