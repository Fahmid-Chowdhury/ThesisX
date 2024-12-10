import { useContext } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SupervisorContext } from "../../Contexts/SupervisorContext/SupervisorContext"
import AdvancedFilter from "../../Components/AdvancedFilter/AdvancedFilter";
import CustomSelect from "../../Components/CustomSelect/CustomSelect";


const SearchBarWithFilters = () => {
    const tags = [
        // Architecture (ARC)
        "Urban Design",
        "Sustainable Architecture",
        "Building Information Modeling (BIM)",
        "Landscape Design",
        "Housing and Community Development",
    
        // Computer Science and Engineering (CSE)
        "Artificial Intelligence",
        "Cybersecurity",
        "Data Science",
        "Software Engineering",
        "Machine Learning",
    
        // Economics and Social Sciences (ECO_SSC)
        "Behavioral Economics",
        "Development Economics",
        "Public Policy",
        "Social Justice",
        "Game Theory",
    
        // Electrical and Electronic Engineering (EEE)
        "Renewable Energy",
        "Embedded Systems",
        "Signal Processing",
        "Power Systems",
        "VLSI Design",
    
        // English and Humanities (ENG_HUM)
        "Creative Writing",
        "Linguistics",
        "Postcolonial Studies",
        "Cultural Studies",
        "Literary Analysis",
    
        // Mathematics and Natural Sciences (MNS)
        "Algebra",
        "Differential Equations",
        "Quantum Mechanics",
        "Astrophysics",
        "Biostatistics",
    
        // Pharmacy (PHR)
        "Drug Formulation",
        "Pharmacology",
        "Clinical Pharmacy",
        "Medicinal Chemistry",
        "Pharmaceutical Biotechnology"
    ];

    const {
        searchTerm,
        selectedDepartment,
        selectedTags,
        updateFilters,
        fetchFaculties,
    } = useContext(SupervisorContext);

    const handleTagClick = (tag) => {
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];
        updateFilters({
            tags: updatedTags,
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
        fetchFaculties()

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
                    className="w-full px-4 py-3 rounded-lg bg-[hsl(220,15%,95%)] dark:bg-[hsl(0,0%,10%)] dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-themeColDark dark:focus:ring-themeColLight border border-[hsl(0,0,85%)] dark:border-[hsl(0,0,15%)]"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-3 bg-themeColDark dark:bg-themeColLight hover:bg-blue-600 text-white rounded-md text-nowrap"
                >
                    <MagnifyingGlassIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Advanced Search Toggle */}
            <div className="flex justify-between items-center mt-2 relative">
                <AdvancedFilter>
                    <div className="flex flex-col justify-center p-5 ">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Department
                            </label>
                            
                            <CustomSelect value={selectedDepartment} options={[
                                { label: 'Architecture', value: 'ARC' },
                                { label: 'Computer Science and Engineering', value: 'CSE' },
                                { label: 'Economics and Social Sciences', value: 'ECO_SSC' },
                                { label: 'Electrical and Electronic Engineering', value: 'EEE' },
                                { label: 'English and Humanities', value: 'ENG_HUM' },
                                { label: 'Mathematics and Natural Sciences', value: 'MNS' },
                                { label: 'Pharmacy', value: 'PHR' }
                            ]} onChange={(newValue) =>
                                updateFilters({
                                    searchTerm,
                                    department: newValue,
                                    tags: selectedTags

                                })
                            } />

                            
                        </div>
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select tags
                            </label>
                            <div className="flex flex-wrap gap-2 max-w-screen-sm">
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedTags.includes(tag)
                                                ? "bg-themeColDark dark:bg-themeColLight text-white border-themeColDark dark:border-themeColLight"
                                                : "bg-transparent opacity-40 hover:opacity-60 border-[hsl(0,0,10%)] dark:border-[hsl(0,0,90%)]"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-3 flex justify-end gap-3">
                            <button className="px-4 py-2 bg-themeColDark dark:bg-themeColLight rounded-md text-white"
                                onClick={()=>{
                                    updateFilters({
                                        searchTerm: searchTerm,
                                        department: "",
                                        tags:"",
                                    })
                                }}
                            >Clear</button>
                        </div>
                    </div>
                </AdvancedFilter>
            </div>

        </div>
    );
};

export default SearchBarWithFilters;