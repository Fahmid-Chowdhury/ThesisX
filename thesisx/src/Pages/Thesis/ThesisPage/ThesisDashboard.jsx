import { useParams, Outlet, Link } from "react-router-dom";
import { ThesisProvider, useThesis } from "../../../Contexts/ThesisContext/ThesisContext";
import NotFound from "../../../Components/NotFound/NotFound";
import Forbidden from "../../../Components/Forbidden/Forbidden";
import ThesisHero from "./ThesisHero";
import ThesisNav from "./ThesisNav";

const ThesisDashboardContent = () => {
    const { thesisData, loading, error } = useThesis();

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
            {!thesisData.supervisorId && (
                <div className="mb-6 p-4 bg-[hsl(50,90%,95%)] dark:bg-[hsl(50,90%,5%)] border border-[hsl(50,80%,70%)] dark:border-[hsl(50,80%,30%)] rounded-lg">
                    <p className="text-[hsl(50,70%,30%)] dark:text-[hsl(50,70%,70%)]">
                        No supervisor assigned.{" "}
                        <Link to="/supervisors" className="underline text-themeColDark dark:text-themeColLight">
                            Browse supervisors
                        </Link>{" "}
                        to kickstart your thesis journey.
                    </p>
                </div>
            )}
            <ThesisHero payload={thesisData} />
            <ThesisNav />
            <Outlet />
        </div>
    );
};

const ThesisDashboard = () => {
    const { id } = useParams();

    return (
        <ThesisProvider thesisId={id}>
            <ThesisDashboardContent />
        </ThesisProvider>
    );
};

export default ThesisDashboard;
