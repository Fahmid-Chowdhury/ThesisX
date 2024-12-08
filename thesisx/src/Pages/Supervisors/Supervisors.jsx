import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SupervisorProvider, SupervisorContext } from "../../Contexts/SupervisorContext/SupervisorContext"
import SearchBarWithFilters from './SearchBarWithFilters';
import SupervisorList from "./SupervisorList";

const Supervisors = () => {
    return (
        <SupervisorProvider>
            <div className="relative">
                <SearchBarWithFilters />
                <SupervisorList />
            </div>
        </SupervisorProvider>
    )
}

export default Supervisors