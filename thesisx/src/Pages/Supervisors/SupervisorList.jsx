import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import {useStete, useContext} from 'react';
import { SupervisorContext } from "../../Contexts/SupervisorContext/SupervisorContext";
import { GetStaticImage } from "../../utils/imageAPI";

const SupervisorCard = ({ supervisor }) => {
    return (
        <div className="bg-white dark:bg-black shadow-md rounded-lg p-4 flex flex-col justify-between">
            <div className="flex justify-between">
                <div className="flex ">
                    {/* Image Section */}
                    <img
                        src={GetStaticImage(supervisor.user.image, "?format=true&height=200&width=200") || "profile.webp"} // Assuming the image URL is provided in the supervisor object
                        alt={`${supervisor.user.name}'s profile`}
                        className="w-[70px] h-[70px] rounded-md object-cover mr-4"
                    />
                    <div className="flex flex-col justify-between" >
                        <div>
                            <h3 className="text-xl font-bold text-black dark:text-white text leading-none">
                                {supervisor.user.name}
                            </h3>
                            <p className="text-sm text-black dark:text-white opacity-50 mt-2 leading-none">
                                Dept: {supervisor.user.department}
                            </p>
                        </div>
                        <p className="text-sm text-black dark:text-white w-fit ">
                        
                        {supervisor.availability > 0
                            ? `${supervisor.availability} slots open`
                            : "Not available"}
                        </p>
                    </div>
                </div>
                <button>
                    <ArrowRightCircleIcon className="w-10 h-10 opacity-50 hover:opacity-100" />
                </button>

            </div>
        </div>
    );
};


const SupervisorList = () => {
    // Accessing the context
    const {
        filteredFaculties,
        loading,
        updateFilters,
        searchTerm,
        selectedDepartment,
        selectedTags,
    } = useContext(SupervisorContext);

    // Loading and error handling
    if (loading) {
        return (
            <div className="flex justify-center items-center p-5">
                <p className="text-lg text-gray-500">Loading faculties...</p>
            </div>
        );
    }

    if (!filteredFaculties || filteredFaculties.length === 0) {
        return (
            <div className="flex justify-center items-center p-5">
                <p className="text-lg text-red-500">No faculties found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="p-5 max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredFaculties.map((supervisor) => (
                    <SupervisorCard key={supervisor.id} supervisor={supervisor} />
                ))}
            </div>
        </div>
    );
};


export default SupervisorList;