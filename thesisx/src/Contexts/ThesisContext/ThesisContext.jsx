import { createContext, useContext, useState, useEffect } from "react";

const ThesisContext = createContext();

export const ThesisProvider = ({ children, thesisId }) => {
    const [thesisData, setThesisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchThesis = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const apiDomain = import.meta.env.VITE_API_DOMAIN;
                const response = await fetch(`${apiDomain}/api/thesis/get-thesis-by-id/${thesisId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setThesisData(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchThesis();
    }, [thesisId]);

    return (
        <ThesisContext.Provider value={{ thesisData, loading, error }}>
            {children}
        </ThesisContext.Provider>
    );
};

export const useThesis = () => {
    return useContext(ThesisContext);
};
