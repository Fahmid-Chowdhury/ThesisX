import { Link } from "react-router-dom";

const Forbidden = ({ redirect, redirectName }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-5">
            <h1 className="text-9xl font-bold ">403</h1>
            <h2 className="text-4xl font-semibold mt-4">Forbidden</h2>
            <p className="text-lg mt-2 opacity-50 text-center">
                Oops! You do not have permission to access this page.
            </p>
            <Link
                to={redirect}
                className="mt-6 px-6 py-3 bg-themeColDark dark:bg-themeColLight text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
                {redirectName}
            </Link>
        </div>
    );
};

export default Forbidden;