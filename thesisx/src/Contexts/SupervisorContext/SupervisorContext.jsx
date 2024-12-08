import { createContext, useState, useEffect } from 'react';
const SupervisorContext = createContext();

const SupervisorProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    
    const updateFilters = (filters) => {
        setSearchTerm(filters.searchTerm || "");
        setSelectedDepartment(filters.department || "");
        setSelectedTags(filters.tags || []);
    };

    return (
        <SupervisorContext.Provider value={{ searchTerm, selectedDepartment, selectedTags, updateFilters }}>
            {children}
        </SupervisorContext.Provider>
    );
};

export { SupervisorContext, SupervisorProvider };