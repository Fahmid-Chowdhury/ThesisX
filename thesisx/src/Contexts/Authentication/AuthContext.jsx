import { createContext, useState, useEffect } from 'react';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To show a loading state while fetching user data
    
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken);
        } else {
            setLoading(false); // If no token, stop loading and proceed
        }
    }, []);

    const fetchUserData = async (authToken) => {
        try {
            // get user info
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('response success')
                setUser(userData);
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

    const signIn = (authToken) => {
        localStorage.setItem('authToken', authToken);
        setToken(authToken);
        fetchUserData(authToken);
    };

    const signOut = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };