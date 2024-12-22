import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import NotFound from '../../../Components/NotFound/NotFound';
const SupervisorProfile = () => {
    const { id } = useParams();
    const [supervisor, setSupervisor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    return (
        <>
            {id}
            <NotFound redirect={"/"} redirectName={"Go back to Home page"}/>
        </>
    )
}

export default SupervisorProfile