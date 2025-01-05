import { createContext, useState, useEffect } from 'react';
const PaperContext = createContext();

const PaperProvider = ({ children }) => {
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateFilters = (filters) => {
        setSearchTerm(filters.searchTerm || '');
    };

    const fetchPapers = async () => {
        setLoading(true);

        try {
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const params = new URLSearchParams();
            if (searchTerm) params.append('searchTerm', searchTerm);

            const token = localStorage.getItem('authToken');

            const response = await fetch(`${apiDomain}/api/document/get-papers?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
                },
            });

            const result = await response.json();

            if (result.success) {
                setFilteredPapers(result.data);
            } else {
                console.error('Failed to fetch research papers');
            }
        } catch (error) {
            console.error('Error fetching research paper:', error);
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch faculties whenever filters change
    useEffect(() => {
        fetchPapers();
    }, []);

    return (
        <PaperContext.Provider
            value={{
                searchTerm,
                setSearchTerm,
                updateFilters,
                loading,
                fetchPapers,
                filteredPapers
            }}
        >
            {children}
        </PaperContext.Provider>
    );
};
export { PaperContext, PaperProvider };