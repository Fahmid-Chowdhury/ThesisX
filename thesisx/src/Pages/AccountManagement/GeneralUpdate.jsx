import React, { useState } from "react";
import { DangerAlert, SuccessAlert } from "../../Components/Alert/Alert"


const BasicInfoUpdate = ({ userData, setUserData }) => {
    const [formData, setFormData] = useState({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${apiDomain}/api/user/update-basic-info`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                setUserData((prev) => ({ ...prev, ...formData }));
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000); // Success message for 5 seconds
            } else {
                setError(result.message || "Failed to update user information.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="bg-white dark:bg-black p-5 rounded-md">
            <h2 className="text-lg font-bold text-black dark:text-white">
                Update Basic Information
            </h2>
            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2 mb-3"></div>

            {success && <SuccessAlert text ={"Profile updated successfully!"}/>}
            {error && <DangerAlert text ={error}/>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-[hsl(0,0,100%)] dark:bg-transparent  dark:border focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-[hsl(0,0,100%)] dark:bg-transparent dark:border focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-[hsl(0,0,100%)] dark:bg-transparent dark:border focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight"
                        rows="3"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-[hsl(210,80%,55%)] text-white py-2 px-4 rounded hover:bg-[hsl(210,70%,45%)]"
                    disabled={loading}
                >
                    {!loading ? "Save Changes" : "Saving..."}
                </button>
            </form>
        </div>
    );
};

export default BasicInfoUpdate;
