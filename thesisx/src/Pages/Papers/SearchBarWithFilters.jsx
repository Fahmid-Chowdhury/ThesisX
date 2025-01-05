import { useContext } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PaperContext } from "../../Contexts/PaperContext/PaperContext"


const SearchBarWithFilters = () => {
    const {
        searchTerm,
        updateFilters,
        fetchPapers,
    } = useContext(PaperContext);

    const handleSearch = () => {
        updateFilters({
            searchTerm,
        });
        fetchPapers()
    };

    return (
        <div className="p-5 rounded-lg max-w-7xl mx-auto">
            {/* Search Input */}
            <div className="flex justify-between items-center gap-3 transition-all">
                <input
                    type="text"
                    placeholder="Search research papers..."
                    value={searchTerm}
                    onChange={(e) =>
                        updateFilters({
                            searchTerm: e.target.value,
                        })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,15%,95%)] dark:bg-[hsl(0,0%,10%)] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight border border-[hsl(0,0,85%)] dark:border-[hsl(0,0,15%)]"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-3 bg-themeColDark dark:bg-themeColLight hover:bg-blue-600 text-white rounded-md text-nowrap"
                >
                    <MagnifyingGlassIcon className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
};

export default SearchBarWithFilters;