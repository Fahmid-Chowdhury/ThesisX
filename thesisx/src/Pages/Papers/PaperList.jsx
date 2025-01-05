import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { useContext } from 'react';
import { PaperContext } from "../../Contexts/PaperContext/PaperContext";
import { useNavigate } from "react-router-dom";
import { GetStaticPreview } from "../../utils/imageAPI";

const PaperCard = ({ paper }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-[hsl(0,0,100)] dark:bg-black p-6 rounded-lg border border-[hsl(0,0,80)] dark:border-[hsl(0,0,20)] w-full mx-auto">
            <div className="w-full h-48 overflow-hidden  rounded-md ">
                <img
                    src={GetStaticPreview(paper.fileName.replace(".pdf", ".jpeg"), "?format=true&height=800")} // Adjust path as needed
                    alt={paper.title}
                    className="w-full object-cover"
                />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white"
                style={{
                    height: '4.5rem', // Approx. 2 lines height (2 x 1.5rem line height)
                    lineHeight: '1.5rem',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                }}
            >{paper.title}</h2>

            <p className="mt-2 text-sm text-gray-700 opacity-70 dark:text-gray-300"
                style={{
                    height: '3rem', // Approx. 2 lines height (2 x 1.5rem line height)
                    lineHeight: '1.5rem',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                }}
            >
                <strong>Authors:</strong> {paper.authors.join(", ")}
            </p>
            
            <button className="w-full mt-4 py-2 px-4 text-white rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                onClick={()=>{navigate(`/papers/${paper.id}`)}}
            >
                Read Paper
            </button>

            
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