import { createContext, useState, useEffect } from 'react';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To show a loading state while fetching user data
    const [thesis, setThesis] = useState(null); 
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
            fetchUserData(storedToken);
            fetchThesis();

            setLoading(false); // Stop loading
        } else {
            setLoading(false); // If no token, stop loading and proceed
        }
    }, [ refresh ]);
    const fetchThesis = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;

            const response = await fetch(`${apiDomain}/api/thesis/get-thesis`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            if (data.success && data.thesisID) {
                setThesis(data);
            } 
        } catch (err) {
            console.error(err);
            setMessage("An error occurred while fetching your thesis data.");
        } 
    };

    const fetchUserData = async (authToken) => {
        try {
            // get user info
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/user/getuser`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const res = await response.json();
                setUser(res.data);
            } else {
                setUser(null);
                localStorage.removeItem('authToken'); // If fetching user fails, remove token
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
            localStorage.removeItem('authToken'); // On error, remove token
        }
    };


    return (
        <AuthContext.Provider value={{ user, loading, fetchUserData, setRefresh, refresh, thesis }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };