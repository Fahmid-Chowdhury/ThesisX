import { createContext, useState, useEffect } from 'react';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To show a loading state while fetching user data
    
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            fetchUserData(storedToken);
        } else {
            setLoading(false); // If no token, stop loading and proceed
        }
    }, []);

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
        } finally {
            setLoading(false); // Stop loading once data is fetched
        }
    };


    return (
        <AuthContext.Provider value={{ user, loading, fetchUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };