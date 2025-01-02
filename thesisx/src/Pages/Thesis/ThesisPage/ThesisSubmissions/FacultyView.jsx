import React, { useState, useEffect } from 'react';
import { useThesis } from '../../../../Contexts/ThesisContext/ThesisContext';
import CustomSelect from '../../../../Components/CustomSelect/CustomSelect';
import { set } from 'date-fns';

const CreateSubmissionForm = ({ submission, onSubmit }) => {
    const [title, setTitle] = useState(submission ? submission.title : '');
    const [instruction, setInstruction] = useState(submission ? submission.instruction : '');
    const [type, setType] = useState(submission ? submission.type : 'Normal');
    const [deadline, setDeadline] = useState(submission ? submission.deadline : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const deadlineDate = new Date(deadline);
        onSubmit({ title, instruction, type, deadline: deadlineDate.toISOString() });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-[hsl(0,0,100)] dark:bg-black shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-800"
        >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {submission ? 'Edit Submission' : 'Create Submission'}
            </h2>

            <div className="mb-4">
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-transparent focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="instruction"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Instruction
                </label>
                <textarea
                    id="instruction"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-transparent focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Type
                </label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-transparent focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                </select>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Deadline
                </label>
                <input
                    type="datetime-local"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-transparent focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                {submission ? 'Update Submission' : 'Create Submission'}
            </button>
        </form>
    );
};

const SubmissionCard = ({ submission }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(submission.title);
    const [instruction, setInstruction] = useState(submission.instructions);
    const [type, setType] = useState(submission.type);
    const [deadline, setDeadline] = useState(submission.deadline);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTitle(submission.title);
        setInstruction(submission.instructions);
        setType(submission.type);
        setDeadline(submission.deadline);
    };

    const formatDeadline = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const deadlineDate = new Date(deadline).toISOString();
        const updatedSubmission = {
            submissionId: submission.id,
            title,
            instructions: instruction,
            type,
            deadline: deadlineDate,
        }

        try {
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            const response = await fetch(`${apiDomain}/api/thesis/update-submissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedSubmission),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update submission");
            }

            setIsEditing(false);
            setLoading(false);
        }
        catch (err) {
            setError(err);
            handleCancel();
            setLoading(false);
        }
    };

    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-800 mb-4">
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border dark:border-[hsl(0,0,25)] rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-transparent focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="instruction" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Instruction
                        </label>
                        <textarea
                            id="instruction"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border dark:border-[hsl(0,0,25)] rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-transparent focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Type
                        </label>
                        
                        <CustomSelect value={type} options={[
                            { value: "Normal", label: "Normal" },
                            { value: "P1", label: "P1" },
                            { value: "P2", label: "P2" },
                            { value: "Final", label: "Final" },
                        ]} onChange={(option) => setType(option)} />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            id="deadline"
                            value={formatDeadline(deadline)}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border dark:border-[hsl(0,0,25)] rounded-lg shadow-sm text-gray-900 dark:text-gray-100 bg-transparent focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 border border-x-themeColDark dark:border-themeColLight text-themeColDark dark:text-themeColLight rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                            Save
                        </button>
                    </div>
                </form>
            ) : (
                <>

                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
                        {instruction}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        <p>
                            <span className="font-medium">Type:</span> {type}
                        </p>
                        <p>
                            <span className="font-medium">Deadline:</span>{" "}
                            {new Date(deadline).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <a
                            href={submission.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                            {
                                submission.file ? "View File" : "No file uploaded"
                            }
                            
                        </a>
                        <button className="text-gray-700 dark:text-gray-300 text-sm font-medium py-1 px-3 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                    </div>

                </>
            )}
        </div>
    );
};

const FacultyView = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [floaterror, setFloatError] = useState(null);
    const [showForm, setShowForm] = useState(false); // Toggle for the form
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



    const handleAddSubmission = async (newSubmission) => {
        try{
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            const response = await fetch (`${apiDomain}/api/thesis/create-submissions`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...newSubmission,
                    thesisId: thesisData.id,
                }),
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to add submission");
            }
            setSubmissions((prev) => [...prev, data.data]);
            setShowForm(false);

        } catch (err) {
            setFloatError(err.message);
        } 
    };

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error.message}</div>;
    }

    return (
        <div className="mt-3">
            {floaterror && (
                <div className="bg-red-500 text-white p-3 mb-3 rounded-lg">
                    {floaterror}
                </div>
            )}

            <button
                className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
                onClick={() => setShowForm((prev) => !prev)}
            >
                {showForm ? "Cancel" : "Add New Submission"}
            </button>

            {showForm && (
                <div className="mb-6">
                    <CreateSubmissionForm onSubmit={handleAddSubmission} />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                {submissions.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission} />
                ))}
            </div>
        </div>
    );
};

export default FacultyView;
