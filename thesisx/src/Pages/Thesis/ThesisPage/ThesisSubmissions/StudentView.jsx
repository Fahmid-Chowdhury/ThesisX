import { useState, useEffect } from 'react';
import { useThesis } from '../../../../Contexts/ThesisContext/ThesisContext';

const SubmissionCard = ({ submission }) => {
    // Format the deadline for display
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString(); // Example: "1/13/2025, 5:59 PM"
    };

    return (
        <>
            {/* Debugging JSON Output */}
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mb-4 overflow-auto">
                {JSON.stringify(submission, null, 4)}
            </pre>

            {/* Submission Card */}
            <div className="bg-[hsl(0,0,100)] dark:bg-black border border-[hsl(0,0,75%)] dark:border-[hsl(0,0,25%)] rounded-lg p-4 shadow-lg">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {submission.title}
                </h3>

                {/* Instructions */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-wrap">
                    {submission.instructions}
                </p>

                {/* Details */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <p>
                        <span className="font-medium">Type:</span> {submission.type}
                    </p>
                    <p>
                        <span className="font-medium">Deadline:</span> {formatDate(submission.deadline)}
                    </p>
                </div>

                {/* File Link */}
                {submission.file ? (
                    <a
                        href={submission.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        View Attached File
                    </a>
                ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">
                        No file attached.
                    </p>
                )}
            </div>
        </>
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
            <div className="grid grid-cols-1 gap-4">
                {submissions.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} />
                ))}
            </div>

        </>
    )
}

export default StudentView