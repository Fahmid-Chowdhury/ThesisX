import { useState } from "react"
import { useNavigate } from "react-router-dom";
import NoResults from "../../assets/NoResults";
import { useFacultyThesis, FacultyThesisProvider } from "../../Contexts/FacultyThesisContext/FacultyThesisContext"
import BarLoader from "react-spinners/BarLoader";

const ThesisList = () => {
    const { thesisData, loading, error } = useFacultyThesis();
    
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className='h-full flex flex-col items-center justify-center'>
                <BarLoader
                    color={'hsl(210 80% 55%)'}
                    height={'6px'}
                    width={'150px'}
                />
            </div>
        )
    }
    if (error) {
        return (
            <div className='h-full flex flex-col items-center justify-center'>
                {error}
            </div>
        )
    }


    if (thesisData.length > 0) {
        return (
            <div className="max-w-7xl mx-auto sm:p-6 p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {thesisData.map(thesis => (
                        <div
                            key={thesis.id}
                            className="bg-[hsl(0,0,100)] dark:bg-black rounded-lg p-5 border border-[hsl(0,0%,80%)] dark:border-[hsl(0,0%,20%)] flex flex-col justify-between"
                        >
                            {/* Title */}
                            <h2
                                className="text-xl font-semibold mb-2 overflow-hidden"
                                style={{
                                    height: '3rem', // Approx. 2 lines height (2 x 1.5rem line height)
                                    lineHeight: '1.5rem',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                {thesis.title}
                            </h2>
                            <div className="h-[1px] w-full bg-black dark:bg-white opacity-15 mb-2"></div>

                            {/* Details */}
                            <div className="text-sm text-gray-500 mb-4">
                                <p className="text-xs text-gray-400 mt-1">
                                    <span className="font-medium">Created at:</span> {new Date(thesis.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* View Button */}
                            <button
                                className="mt-auto text-themeColDark dark:text-themeColLight text-sm font-medium py-2 px-4 rounded-lg border border-themeColDark dark:border-themeColLight"
                                onClick={() => navigate(`/thesis/t/${thesis.id}`)} // Replace with navigation logic
                            >
                                View Thesis
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Case when there is no data
    return (
        <div className="p-6 h-full flex flex-col items-center justify-center">
            <div className="mb-4 dark:opacity-50">
                <NoResults height={"300"} width={"300"} />
            </div>
            <p className='text-center opacity-75'>You are not supervising any thesis at this moment</p>
        </div>
    );
}

const SupervisorThesis = () => {
    return (
        <FacultyThesisProvider>
            <ThesisList />
        </FacultyThesisProvider>
    )
}

export default SupervisorThesis