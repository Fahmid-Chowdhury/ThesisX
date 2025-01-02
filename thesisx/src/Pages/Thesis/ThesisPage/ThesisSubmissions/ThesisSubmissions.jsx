import { useContext, useState } from 'react';
import FacultyView from './FacultyView';
import StudentView from './StudentView';
import { AuthContext } from '../../../../Contexts/Authentication/AuthContext';
import Forbidden from '../../../../Components/Forbidden/Forbidden';




const ThesisSubmissions = () => {
    const { user } = useContext(AuthContext);
    
    if (user.role === "STUDENT") {
        return <StudentView />;
    }

    if (user.role === "FACULTY") {
        return <FacultyView />;
    }

    return (
        <Forbidden redirect={"/"} redirectName={"Go back home"} />
    )
}

export default ThesisSubmissions