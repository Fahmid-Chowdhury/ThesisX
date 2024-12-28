import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ResearchAndPublications = ({ userData, setUserData }) => {
    const { role, facultyDetails, studentDetails } = userData;
    const isFaculty = role === "FACULTY";
    const isStudent = role === "STUDENT";

    const initialResearchInterests = isFaculty
        ? facultyDetails?.researchInterests || []
        : studentDetails?.researchInterests || [];
    
    const [researchInterests, setResearchInterests] = useState(initialResearchInterests);
    const [newInterest, setNewInterest] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isFaculty && !facultyDetails) {
            setResearchInterests([]);
        } else if (!isFaculty && !studentDetails) {
            setResearchInterests([]);
        }
    }, [facultyDetails, studentDetails, isFaculty]);

    // Add a new research interest for students
    const handleAddInterest = async () => {
        if (newInterest.trim() === "") {
            setError("Please enter a valid interest.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const updatedInterests = [...researchInterests, newInterest.trim()];
        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${apiDomain}/api/user/update-research-interests`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ interests: updatedInterests }),
            });

            const result = await response.json();
            if (result.success) {
                setResearchInterests(updatedInterests);
                setUserData((prev) => ({
                    ...prev,
                    [isFaculty ? "facultyDetails" : "researchInterests"]: updatedInterests,
                }));
                setNewInterest("");
            } else {
                throw new Error(result.message || "Failed to add research interest.");
            }
        } catch (error) {
            setError(error.message || "An error occurred while adding the interest.");
        } finally {
            setIsLoading(false);
        }
    };

    // Remove a research interest for students
    const handleRemoveInterest = async (interest) => {
        const updatedInterests = researchInterests.filter((item) => item !== interest);
        setIsLoading(true);
        setError(null);

        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${apiDomain}/api/user/update-research-interests`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ interests: updatedInterests }),
            });

            const result = await response.json();
            if (result.success) {
                setResearchInterests(updatedInterests);
                setUserData((prev) => ({
                    ...prev,
                    [isFaculty ? "facultyDetails" : "researchInterests"]: updatedInterests,
                }));
            } else {
                throw new Error(result.message || "Failed to remove research interest.");
            }
        } catch (error) {
            setError(error.message || "An error occurred while removing the interest.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black p-5 rounded-md shadow-md mt-6">
            <h2 className="text-lg font-bold text-[hsl(240,10%,20%)] dark:text-[hsl(240,10%,80%)] ">
                Research Interests and publications
            </h2>
            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2 mb-3"></div>


            {/* Error message */}
            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* Research Interests Section */}
            <div>
                <h3 className="font-semibold mb-2">Research Interests</h3>
                {researchInterests.length > 0 ? (
                    <ul className="mb-4 flex gap-3">
                        {researchInterests.map((interest, index) => (
                            <li key={index} className="flex justify-between items-center gap-2 px-1 py-1 border rounded-full dark:border-[hsl(0,0%,50%)]">
                                <p className="ml-2">
                                    {interest}
                                </p>
                                <button
                                    onClick={() => handleRemoveInterest(interest)}
                                    className="p-1 bg-[hsl(0,70,50)] rounded-full"
                                >
                                    <XMarkIcon className="w-4 h-4 text-white " />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No research interests available. You can add new interests.</p>
                )}
                
                {/* Add new interest */}
                {(isStudent || isFaculty) && (
                    <div>
                        <input
                            type="text"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Add new interest"
                            className="w-full p-2 rounded-lg bg-[hsl(0,0,100%)] dark:bg-transparent  dark:border focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight dark:border-[hsl(0,0%,50%)]"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleAddInterest}
                            className="bg-[hsl(210,80%,55%)] text-white py-2 px-4 rounded hover:bg-[hsl(210,70%,45%)] mt-3"
                            disabled={isLoading}
                        >
                            {isLoading ? "Adding..." : "Add Interest"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchAndPublications
