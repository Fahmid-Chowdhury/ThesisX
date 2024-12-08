import { useContext, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SupervisorProvider, SupervisorContext } from "../../Contexts/SupervisorContext/SupervisorContext"

const SearchBarWithFilters = () => {
    const [showFilters, setShowFilters] = useState(false);
    const departments = ["CSE", "MNS"];
    const tags = ["AI", "Machine Learning"];

    const {
        searchTerm,
        selectedDepartment,
        selectedTags,
        updateFilters,
    } = useContext(SupervisorContext);

    const handleTagClick = (tag) => {
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];
        updateFilters({ tags: updatedTags,
            searchTerm,
            department: selectedDepartment
         });
    };

    const handleSearch = () => {
        updateFilters({
            searchTerm,
            department: selectedDepartment,
            tags: selectedTags
        });
    };

    return (
        <div className="p-5 rounded-lg max-w-7xl mx-auto">
            {/* Search Input */}
            <div className="flex justify-between items-center gap-3 transition-all">
                <input
                    type="text"
                    placeholder="Search supervisors..."
                    value={searchTerm}
                    onChange={(e) =>
                        updateFilters({ 
                            searchTerm: e.target.value,
                            department: selectedDepartment,
                            tags: selectedTags 
                        })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,15%,95%)] dark:bg-[hsl(0,0%,10%)] bg-transparent dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight shadow-[0px_0px_5px_3px_rgba(0,_0,_0,_0.1)] dark:shadow-[0px_0px_5px_3px_rgba(0,_0,_0,_0.8)]"
                />
                <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className="px-4 py-3 bg-themeColDark dark:bg-themeColLight hover:bg-blue-600 text-white rounded-md text-nowrap"
                >
                    <MagnifyingGlassIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Advanced Search Toggle */}
            <div className="flex justify-between items-center">
                
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* Filters (Visible when Advanced Search is toggled) */}
            {/* {showFilters && (
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Department
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) =>
                                updateFilters({ 
                                    searchTerm,
                                    department: e.target.value,
                                    tags: selectedTags

                                 })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                        selectedTags.includes(tag)
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

const Supervisors = () => {
  return (
    <SupervisorProvider>
        <SearchBarWithFilters />
    </SupervisorProvider>
  )
}

export default Supervisors