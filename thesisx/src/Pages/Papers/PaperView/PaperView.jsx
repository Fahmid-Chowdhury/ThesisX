import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import NotFound from '../../../Components/NotFound/NotFound';
import LoaderSVG from '../../../assets/LoaderSVG';
import { GetStaticPreview } from '../../../utils/imageAPI';
import { formatDate } from '../../../utils/CommonUtility';

const PaperView = () => {
    const { id } = useParams();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiDomain = import.meta.env.VITE_API_DOMAIN;

    const navigate = useNavigate();
    const fetchpaper = async () => {
        const token = localStorage.getItem('authToken');
        setLoading(true);

        try {
            const response = await fetch(`${apiDomain}/api/document/get-papers/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
                },
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message);
            }

            setPaper(result.data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchpaper();
    }, [id]);
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <LoaderSVG color={"CornflowerBlue"} />
                <p className='mt-3'>Loading...</p>
            </div>
        );
    }

    if (error) {
        return <NotFound redirect={"/"} redirectName={"Go back to Home page"} />;
    }

    return (

        <div className="max-w-7xl mx-auto rounded-lg ">
            <h1 className="text-2xl font-bold p-6">{paper.title}</h1>
            <div className="flex sm:flex-row flex-col">
                <div className='flex flex-col'>
                    <div className="px-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Uploaded on: {formatDate(paper.uploadDate)}
                        </p>
                        <p className="mt-4 text-gray-700 dark:text-gray-300">{paper.abstract}</p>
                    </div>

                    {/* Authors Section */}
                    <div className="px-6 pb-6">
                        <h2 className="text-lg font-semibold mb-2 mt-3">Authors</h2>
                        <ul className="list-disc pl-5">
                            {paper.authors.map((author, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">
                                    {author}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="flex flex-col items-center gap-4 p-6 sm:w-1/3 flex-shrink-0">
                    <img
                        src={GetStaticPreview(paper.fileName.replace(".pdf", ".jpeg"), "?format=true&height=800")} // Replace with your logic to get preview
                        alt={paper.title}
                        className="w-full h-auto rounded-md"
                    />
                    <div className="flex flex-col gap-2 w-full">
                        <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full px-4 py-2 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            View Source
                        </a>
                        <button
                            onClick={() => navigate(`/papers/view/${paper.fileName}`)}
                            className="inline-block w-full px-4 py-2 text-center bg-gray-700 text-white rounded-md hover:bg-gray-800"
                        >
                            Read Paper
                        </button>
                    </div>
                </div>
            </div>
            
        </div>

    );
}

export default PaperView