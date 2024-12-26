import {jwtDecode} from 'jwt-decode';
import StudentThesis from './StudentThesis';
import SupervisorThesis from './SupervisorThesis';
import NotFound from '../../Components/NotFound/NotFound';

const Thesis = () => {
    const token = localStorage.getItem("authToken");

    let role;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            role = decoded.role; // Assuming the token payload includes a "role" field
        } catch (err) {
            console.error("Invalid token", err);
            role = "Invalid token";
        }
    } else {
        role = "No token found";
    }
    
    if (role === "STUDENT") {
        return <StudentThesis />;
    } else if (role === "FACULTY") {
        return <SupervisorThesis />;
    } else {
        return <NotFound redirect={"/"} redirectName={"Go back to Home"} />;
    }
}

export default Thesis