import { useState } from 'react';
import { useThesis } from '../../../../Contexts/ThesisContext/ThesisContext';
import { GetStaticImage } from '../../../../utils/imageAPI';

const ThesisInfo = () => {
    const { thesisData, setThesisData } = useThesis();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: thesisData?.title || "",
        abstract: thesisData?.abstract || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        
        try{
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/thesis/edit-thesis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to save thesis data");
            }

            setThesisData({
                ...thesisData,
                title: formData.title,
                abstract: formData.abstract,
            })
            
            setIsEditing(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            title: thesisData?.title || "",
            abstract: thesisData?.abstract || "",
            supervisorId: thesisData?.supervisorId || "",
        });
        setIsEditing(false);
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-semibold">Thesis Information</h1>
                <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 dark:text-blue-400 hover:underline border border-blue-600 dark:border-blue-400 px-8 py-2 rounded-lg"
                    >
                        Edit
                    </button>
            </div>
            <div className='h-[1px] w-full bg-[hsl(0,0,80)] dark:bg-[hsl(0,0,20)]'></div>

            {isEditing ? (
                <div className="space-y-4 mt-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Abstract</label>
                        <textarea
                            name="abstract"
                            value={formData.abstract}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700"
                        ></textarea>
                    </div>


                    <div className="flex space-x-4">
                        <button
                            onClick={handleCancel}
                            className="text-blue-600 dark:text-blue-400 hover:underline border border-blue-600 dark:border-blue-400 px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] font-semibold mt-3 mb-3 ">
                        Title: {thesisData?.title}
                    </h1>
                    <div className='h-[1px] w-full bg-[hsl(0,0,80)] dark:bg-[hsl(0,0,20)]'></div>
                    <p className="text-xl text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] mt-2 ">
                        Abstract:
                    </p>
                    <p className="text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] mt-2 flex ">
                        {thesisData.abstract ? thesisData.abstract : (
                            <span className='text-center text-[hsl(0,0,50%)] dark:text-[hsl(0,0,50%)] w-full italic'>
                                No abstract available
                            </span>

                        )}
                    </p>

                    <div className='h-[1px] w-full bg-[hsl(0,0,80)] dark:bg-[hsl(0,0,20)] mt-3'></div>

                    {
                        thesisData.supervisorId ? (
                            <div className="flex flex-col gap-4 mt-2">
                                <p className="text-[hsl(0,0%,20%)] dark:text-[hsl(0,0%,80%)]">Supervisor:</p>
                                <div className="flex items-center gap-2">
                                    <div className='flex-shrink-0 aspect-square w-12 rounded-full overflow-hidden flex'>
                                        <img
                                            src={GetStaticImage(thesisData.faculty.user.image, "?format=true&width=160&height=160") || "/profile.webp"}
                                            alt={`${thesisData.faculty.user.name}'s profile`}
                                            className=" object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{thesisData.faculty.user.name}</h3>
                                        <p className="text-sm text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">{thesisData.faculty.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 flex-col mt-2">
                                <p className="text-[hsl(0,0%,50%)] dark:text-[hsl(0,0%,50%)]">No supervisor assigned</p>
                            </div>
                        )
                    }

                    

                </>

            )}
        </div>
    );
};


export default ThesisInfo   