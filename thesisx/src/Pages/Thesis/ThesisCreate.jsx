import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/Authentication/AuthContext";

const CreateThesis = () => {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setRefresh } = useContext(AuthContext);

    const navigate = useNavigate();
    const formRef = useRef(null); // Create a ref for the form

    const handleCancel = () => {
        navigate("/thesis"); // Navigate back to the thesis page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Thesis title submitted:", title);
        // Add your logic to create a thesis here
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const apiDomain = import.meta.env.VITE_API_DOMAIN;

        try{
            const response = await fetch(`${apiDomain}/api/thesis/create-thesis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);

            }

            const data = await response.json();
            setRefresh(true);
            console.log("Thesis created:", data);
            navigate(`/thesis/t/${data.thesis.id}`); 
        } catch (error) {
            console.error("Thesis creation failed:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };

    const triggerSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit(); // Trigger the form submit
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="bg-white dark:bg-black rounded-lg p-6 w-full max-w-md border border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)]">
                <h2 className="text-xl mb-4">Create Thesis</h2>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-4 border p-6 rounded-lg border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)]"
                >
                    <div>
                        <label
                            htmlFor="thesisTitle"
                            className="flex flex-col font-medium text-[hsl(0,0%,15%)] dark:text-[hsl(0,0%,85%)] mb-3"
                        >
                            Thesis Title
                        </label>
                        <input
                            type="text"
                            id="thesisTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 rounded-md bg-[hsl(0,0,100%)] dark:bg-transparent dark:border focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight dark:border-[hsl(0,0%,50%)]"
                            placeholder="Enter your thesis title"
                            required
                        />
                    </div>
                </form>
                {error && <p className="text-[hsl(4,66%,50%)] text-sm mt-2">{error}</p>}
                <div className="mt-6 px-6">
                    <p className="font-medium mb-2">Rules and Requirements:</p>
                    <ul className="list-disc list-inside font-light space-y-2">
                        <li>Title should be concise and descriptive.</li>
                        <li>Make sure the title reflects your research topic.</li>
                        <li>Ensure the title does not exceed 100 characters (if applicable).</li>
                        <li>You can edit the title later in your thesis settings.</li>
                    </ul>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-themeColDark dark:text-themeColLight"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={triggerSubmit}
                        className="px-4 py-2 text-white rounded-full bg-themeColDark dark:bg-themeColLight"
                        disabled={loading}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateThesis;
