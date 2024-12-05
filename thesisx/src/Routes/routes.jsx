import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/Authentication/AuthContext';
// ===============================
import Signin from "../authenticaiton/signin/Signin";
// ===============================

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return <Navigate to="/signin" />;
    }

    return element;
};

const Home = () => {
    return (
        <>
            home
        </>
    )
}

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
    );
};

export default AppRouter;