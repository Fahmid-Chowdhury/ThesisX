import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ThesisJoin = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null); // Create a ref for the form


    const handleCancel = () => {
        navigate("/thesis"); // Navigate back to the thesis page
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Invitation code submitted:", code);
    };

    const triggerSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit(); // Trigger the form submit
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="bg-white dark:bg-black rounded-lg p-6 w-full max-w-md border border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)]">
                <h2 className="text-xl mb-4">
                    Join Thesis
                </h2>

                <form onSubmit={handleSubmit}
                    ref={formRef} 
                    className="space-y-4 border p-6 rounded-lg border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)]">
                    <div>
                        <label
                            htmlFor="thesisTitle"
                            className="flex flex-col font-medium text-[hsl(0,0%,15%)] dark:text-[hsl(0,0%,85%)] mb-3"
                        >
                            Invitation Code
                        </label>
                        <input
                            type="text"
                            id="thesisTitle"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-2 rounded-md bg-[hsl(0,0,100%)] dark:bg-transparent dark:border focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight dark:border-[hsl(0,0%,50%)]"
                            placeholder="Your Invitation Code"
                        />
                    </div>
                </form>
                <div className="mt-6 px-6">
                    <p className="font-medium mb-2">
                        Rules and Requirements:
                    </p>
                    <ul className="list-disc list-inside font-light space-y-2">
                        <li>You will get and invitation code in your email if you are invited to a thesis group</li>
                        <li>In case the code is invalid please contact the thesis group creator or the supervisor to invite you again.</li>
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
                        type="submit"
                        onClick={triggerSubmit}
                        className="px-4 py-2 text-white rounded-full bg-themeColDark dark:bg-themeColLight"
                        disabled={loading}
                    >
                        Join Thesis
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ThesisJoin