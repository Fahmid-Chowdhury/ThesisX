import { useState } from "react";
import { useParams } from "react-router-dom";

const ThesisDashboard = ({ thesis }) => {
    const { id } = useParams();

    return (
        <div className="min-h-screen">
            thesis id : {id}
        </div>
    );
};

export default ThesisDashboard;
