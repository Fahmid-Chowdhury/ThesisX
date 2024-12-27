import { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import NotFound from "../../../Components/NotFound/NotFound";
import Forbidden from "../../../Components/Forbidden/Forbidden";
import ThesisHero from "./ThesisHero";
import ThesisNav from "./ThesisNav";
const ThesisDashboard = ({ thesis }) => {
    const { id } = useParams();
    const [thesisData, setThesisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchThesis = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const apiDomain = import.meta.env.VITE_API_DOMAIN;
            const response = await fetch(`${apiDomain}/api/thesis/get-thesis-by-id/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setThesisData(data.data);

        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchThesis();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error && error === "Thesis not found") {
        return <NotFound redirect={"/"} redirectName={"Go back to home page"} />;
    }

    if (error && error.includes("Forbidden")) {
        return <Forbidden redirect={"/"} redirectName={"Go back to home page"} />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className="max-w-7xl mx-auto p-5">
            {
                !thesisData.supervisorId && (
                    <div className="mb-6 p-4 bg-[hsl(50,90%,95%)] dark:bg-[hsl(50,90%,5%)] border border-[hsl(50,80%,70%)] dark:border-[hsl(50,80%,30%)] rounded-lg">
                        <p className="text-[hsl(50,70%,30%)] dark:text-[hsl(50,70%,70%)]">
                            No supervisor assigned.{" "}
                            <Link to="/supervisors" className="underline text-themeColDark dark:text-themeColLight">
                                Browser supervisors
                            </Link>{" "}
                            to kickstart your thesis journey.
                        </p>
                    </div>

                )
            }
            <ThesisHero payload={thesisData} />
            <ThesisNav />
            <Outlet />

        </div>
    );
};

export default ThesisDashboard;
