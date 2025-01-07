import { useState, useEffect } from 'react';
import { useThesis } from '../../../../Contexts/ThesisContext/ThesisContext';
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const SubmissionCard = ({ submission }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('authToken');
    const apiDomain = import.meta.env.VITE_API_DOMAIN;

    // Format the deadline for display
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString(); // Example: "1/13/2025, 5:59 PM"
    };

    const handleSubmitWork = async () => {
        if (!selectedFile) {
            alert("Please select a file before submitting.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("submissionId", submission.id); // Add submission ID
            formData.append("submission", selectedFile); // Add the selected file

            const response = await fetch(`${apiDomain}/api/thesis/submit-submissions`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`, // Authorization header
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit work");
            }

            alert("Submission successful!");
        } catch (err) {
            console.error(err);
            alert(err.message || "An error occurred during submission.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = () => {
        // Add your logic for removing submitted work here
    };

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const isDeadlineOver = new Date(submission.deadline) <= new Date();

    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black border border-[hsl(0,0,75%)] dark:border-[hsl(0,0,25%)] rounded-lg p-4 shadow-lg">
            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">{submission.title}</h3>

            {/* Instructions */}
            <p className="text-sm text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] mb-4 whitespace-pre-wrap">
                {submission.instructions}
            </p>

            {/* Details */}
            <div className="text-sm text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] mb-4">
                <p>
                    <span className="font-medium">Type:</span> {submission.type}
                </p>
                <p>
                    <span className="font-medium">Deadline:</span> {formatDate(submission.deadline)}
                </p>
            </div>

            {/* File Link */}
            {submission.file ? (
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <a
                        href={submission.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center space-x-2 px-5 py-3 text-sm text-blue-600 dark:text-blue-400 hover:underline border border-blue-600 dark:border-blue-400 rounded-lg"
                    >
                        <p className="text-sm truncate">View Work</p>
                    </a>
                    {!isDeadlineOver && (
                        <button
                            onClick={handleRemoveFile}
                            className="text-sm text-red-600 dark:text-red-400 hover:underline px-5 py-3 border border-red-600 dark:border-red-400 rounded-lg"
                        >
                            Remove Work
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {isDeadlineOver ? (
                        <p className="text-sm text-red-600 dark:text-red-400">No work submitted</p>
                    ) : (
                        <div className="flex flex-col space-y-2 sm:items-start">
                            {selectedFile && (
                                <div className='flex justify-between space-x-2 px-5 py-3 border border-[hsl(0,0,75%)] dark:border-[hsl(0,0,25%)] rounded-lg'>
                                    <p className="text-sm text-[hsl(0,0,20%)] dark:text-[hsl(0,0,80%)] truncate">
                                        {selectedFile.name}
                                    </p>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                            {!selectedFile && (
                                <label className="flex justify-center text-sm text-blue-600 dark:text-blue-400 hover:underline py-3 px-5 border border-blue-600 dark:border-blue-400 rounded-lg cursor-pointer">
                                    <span className='flex items-center space-x-2 gap-2'>
                                        <ArrowUpTrayIcon className="w-5 h-5" />
                                        Add Work
                                    </span>
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {selectedFile && (
                                <button
                                    onClick={handleSubmitWork}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline py-3 px-5 border border-blue-600 dark:border-blue-400 rounded-lg"
                                >
                                    Submit Work
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


const StudentView = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { thesisData } = useThesis();

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            const response = await fetch(`${apiDomain}/api/thesis/get-submissions/${thesisData.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch submissions");
            }

            setSubmissions(data.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSubmissions();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error.message}</div>;
    }


    return (
        <>
            <div className="grid grid-cols-1 gap-4 mt-4">
                {submissions.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} />
                ))}
            </div>

        </>
    )
}

export default StudentView