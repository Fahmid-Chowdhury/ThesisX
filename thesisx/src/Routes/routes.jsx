import { Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
// ===============================
import Signin from "../Authentication/Signin/Signin";
import Signup from "../Authentication/Signup/Signup";
import Navbar from '../Components/Navbar/Navbar';
import Home from '../Pages/Home/Home';
import Thesis from '../Pages/Thesis/Thesis';
import ThesisCreate from '../Pages/Thesis/ThesisCreate';
import ThesisJoin from '../Pages/Thesis/ThesisJoin';
import Supervisors from '../Pages/Supervisors/Supervisors';
import Appointments from '../Pages/Appointments/Appointments';
import Notifications from '../Pages/Notifications/Notifications';
import Profile from '../Pages/Profile/Profile';

import Papers from '../Pages/Papers/Papers';

import AccountManagementLayout from '../Pages/AccountManagement/AccountManagementLayout';
import AccountManagement from '../Pages/AccountManagement/AccountManagement';
import PublicationLayout from '../Pages/AccountManagement/Publication/PublicationLayout'; 
import Publication from '../Pages/AccountManagement/Publication/Publication';  
import PublicationForm from '../Pages/AccountManagement/Publication/PublicationForm';   
import SupervisorProfile from '../Pages/Supervisors/SupervisorProfile/SupervisorProfile';
// import Extra from '../Pages/Extra/Extra';

import ThesisDashboard from '../Pages/Thesis/ThesisPage/ThesisDashboard';
import ThesisStream from '../Pages/Thesis/ThesisPage/ThesisStream/ThesisStream';
import ThesisSubmissions from '../Pages/Thesis/ThesisPage/ThesisSubmissions/ThesisSubmissions';
import ThesisPeople from '../Pages/Thesis/ThesisPage/ThesisPeople/ThesisPeople';
import ThesisInfo from '../Pages/Thesis/ThesisPage/ThesisInfo/ThesisInfo';
import RequestLayout from '../Pages/Appointments/RequestLayout';
import RequestView from '../Pages/Appointments/RequestView';
import StudentProfileView from '../Pages/Appointments/StudentProfileView';
import ResearchPaperLayout from '../Pages/AccountManagement/AddResearchPaper/ResearchPaperLayout';
import PaperView from '../Pages/Papers/PaperView/PaperView';
import PaperRead from '../Pages/Papers/PaperView/PaperRead';
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
            <div className='transition-colors h-screen w-screen bg-[hsl(0,0,95%)] dark:bg-[hsl(0,0,5%)] flex flex-col text-black dark:text-white'>
                <div>
                    {shouldShowNav && <Navbar />}
                </div>
                <div className='h-full overflow-auto '>
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
                {/* <Route path="/extra" element={<Extra />} /> */}
                <Route path="/" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/papers" element={<ProtectedRoute element={<Papers />} />} />
                <Route path="/papers/:id" element={<ProtectedRoute element={<PaperView />} />} />
                <Route path="/papers/view/:url" element={<ProtectedRoute element={<PaperRead />} />} />

                <Route path="/thesis" element={<ProtectedRoute element={<Thesis />} />} />
                <Route path="/thesis/create" element={<ProtectedRoute element={<ThesisCreate />} />} />
                <Route path="/thesis/join" element={<ProtectedRoute element={<ThesisJoin />} />} />
                
                <Route path="/thesis/t/:id" element={<ProtectedRoute element={<ThesisDashboard />} />}>
                    <Route path="" element={<ThesisStream />} />
                    <Route path="submissions" element={<ThesisSubmissions />} />
                    <Route path="people" element={<ThesisPeople />} />
                    <Route path="info" element={<ThesisInfo />} />
                </Route>
                

                <Route path="/supervisors" element={<ProtectedRoute element={<Supervisors />} />} />
                <Route path="/supervisors/:id" element={<ProtectedRoute element={<SupervisorProfile />} />} />

                <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />
                <Route path="/appointments/r/:id" element={<ProtectedRoute element={<RequestLayout />} />}>
                    <Route path="" element={<RequestView/>}/>
                    <Route path="student/:id" element={<StudentProfileView/>}/>
                </Route>

                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
                <Route path="/accountmanagement" element={<ProtectedRoute element={<AccountManagementLayout />} />}>
                    <Route path="" element={<AccountManagement />} />
                    <Route path="publication" element={<PublicationLayout />}>
                        <Route path="" element={<Publication />} />
                        <Route path="add" element={<PublicationForm />} />
                    </Route>
                    <Route path="addresearchpaper" element={<ResearchPaperLayout />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRouter;
