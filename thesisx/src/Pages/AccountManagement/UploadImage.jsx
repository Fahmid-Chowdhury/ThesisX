import React, { useState } from "react";

const UploadImage = ({ userData, setUserData }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(userData.image || "/default-avatar.png");
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Generate a temporary preview URL
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            alert("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedImage);

        try {
            setIsUploading(true);
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const token = localStorage.getItem("authToken");

            const response = await fetch(`${apiDomain}/api/user/upload-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Add token for authentication
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Update the user data with the new image
                setUserData((prevData) => ({
                    ...prevData,
                    image: result.imageName, // Update the image field with the returned image name
                }));

                alert("Image uploaded successfully!");
            } else {
                throw new Error(result.message || "Failed to upload image.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("An error occurred while uploading the image.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className=" bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,10%)] p-5 rounded-lg mt-6">
            <h3 className="text-xl font-semibold">
                Update Image
            </h3>
            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mt-2"></div>

            <div className="flex items-center justify-between gap-4 mt-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[hsl(210,80%,55%)]">
                    <img
                        src={previewImage}
                        alt="Profile"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex gap-2">
                    <div>
                        <label
                            htmlFor="fileInput"
                            className="cursor-pointer inline-block bg-themeColDark dark:bg-themeColLight text-white px-4 py-2 rounded-md shadow-md hover:bg-[hsl(210,70%,50%)] transition"
                        >
                            Browse Image
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden" // Hide the default file input
                        />
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!selectedImage || isUploading}
                        className={`px-4 py-2 rounded-md transition ${
                            !selectedImage || isUploading
                                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-100"
                                : "bg-themeColDark dark:bg-themeColLight text-white hover:bg-[hsl(210,70%,50%)]"
                        }`}
                    >
                        {isUploading ? "Uploading..." : "Upload Image"}
                    </button>
                </div>

            </div>
            
        </div>
    );
};

export default UploadImage;
