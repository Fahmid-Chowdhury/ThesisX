import { useState, useEffect } from "react";

const ThesisPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thesis, setThesis] = useState(null);
  const [action, setAction] = useState(""); // Track 'create' or 'join'

  const fetchThesis = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${apiDomain}/api/thesis/get-thesis`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch thesis data");
      }

      const data = await response.json();
      setThesis(data.thesis || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThesis();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!thesis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          You do not have a thesis yet
        </h1>
        <div className="mt-4 space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            onClick={() => setAction("create")}
          >
            Create Thesis
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
            onClick={() => setAction("join")}
          >
            Join Thesis Group
          </button>
        </div>
        {action === "create" && <CreateThesisForm onComplete={fetchThesis} />}
        {action === "join" && <JoinThesisGroupForm onComplete={fetchThesis} />}
      </div>
    );
  }

  return <ThesisDashboard thesis={thesis} />;
};

export default ThesisPage;
