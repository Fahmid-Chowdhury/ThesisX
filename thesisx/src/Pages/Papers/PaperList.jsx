import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { useContext } from 'react';
import { PaperContext } from "../../Contexts/PaperContext/PaperContext";
import { useNavigate } from "react-router-dom";
import { GetStaticPreview } from "../../utils/imageAPI";

const PaperCard = ({ paper }) => {
    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black p-6 rounded-lg border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] w-full mx-auto">
            <div className="w-full h-48 overflow-hidden  rounded-md ">
                <img
                    src={GetStaticPreview(paper.fileName.replace(".pdf", ".jpeg"), "?format=true&height=800")} // Adjust path as needed
                    alt={paper.title}
                    className="w-full object-cover"
                />
            </div>
            {/* Paper Image */}

            {/* Paper Title */}
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{paper.title}</h2>

            {/* Authors */}
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <strong>Authors:</strong> {paper.authors.join(", ")}
            </p>

            {/* Upload Date */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Uploaded:</strong> {new Date(paper.uploadDate).toLocaleDateString()}
            </p>

            {/* Link to Paper */}
            <a
                href={paper.url}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                Read Paper
            </a>
        </div>
    );
};

const PaperList = () => {
    // Accessing the context
    const {
        filteredPapers,
        loading,
    } = useContext(PaperContext);

    // Loading and error handling
    if (loading) {
        return (
            <div className="flex justify-center items-center p-5">
                <p className="text-lg text-gray-500">Loading Papers...</p>
            </div>
        );
    }

    if (!filteredPapers || filteredPapers.length === 0) {
        return (
            <div className="flex justify-center items-center p-5">
                <p className="text-lg text-red-500">No research papers found.</p>
            </div>
        );
    }

    return (
        <div className="p-5 max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.map((paper) => (
                    <PaperCard key={paper.id} paper={paper} />
                ))}
            </div>
        </div>
    );
};


export default PaperList;