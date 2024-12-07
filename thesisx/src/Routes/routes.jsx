import { Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
// ===============================
import Signin from "../authenticaiton/signin/Signin";
import Signup from "../authenticaiton/signup/Signup";
import Navbar from '../Components/Navbar/Navbar';
import Home from '../Pages/Home/Home';
import Thesis from '../Pages/Thesis/Thesis';
import Supervisors from '../Pages/Supervisors/Supervisors';
import Appointments from '../Pages/Appointments/Appointments';
import Notifications from '../Pages/Notifications/Notifications';
// ===============================

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return <Navigate to="/signin" />;
    }

    return element;
};

const Layout = () => {
    const location = useLocation();
    const noNavRoutes = ["/signin", "/signup"]; // Routes without TopNav
    const shouldShowNav = !noNavRoutes.includes(location.pathname);

    return (
        <>  
            <div className='transition-colors h-screen w-screen bg-[hsl(0,0,95%)] dark:bg-[hsl(0,0,5%)] flex flex-col text-[hsl(0,0,10%)] dark:text-[hsl(0,0,90%)]'>
                <div>
                    {shouldShowNav && <Navbar />}
                </div>
                <div className='h-100 overflow-auto '>
                    <Outlet /> 
                </div>
            </div>
        </>
    );
};

const AppRouter = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches); // Set initial mode based on system

        const handleChange = (event) => {
            setIsDarkMode(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Apply dark or light mode to document root
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [isDarkMode]);
    return (
        <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<Layout />}>
                <Route path="/" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/thesis" element={<ProtectedRoute element={<Thesis />} />} />
                <Route path="/supervisors" element={<ProtectedRoute element={<Supervisors />} />} />
                <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />
                <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
