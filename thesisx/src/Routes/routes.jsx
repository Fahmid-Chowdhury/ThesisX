import { Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';
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
            {shouldShowNav && <Navbar />}
            <Outlet /> 
        </>
    );
};

const AppRouter = () => {
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
