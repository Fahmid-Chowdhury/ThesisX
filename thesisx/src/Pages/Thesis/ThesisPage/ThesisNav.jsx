import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { NavLink } from "react-router-dom"

const ThesisNav = () => {
    return (

        <div className="bg-white dark:bg-[hsl(0,0%,15%)] dark:shadow-none flex justify-between items-center sm:px-5 mt-3 h-10">
            <div className="flex">
                <NavLink
                    key={""}
                    to={""}
                    end
                    className={({ isActive }) =>
                        `block px-4 py-[6px]  hover:text-themeColDark dark:hover:text-themeColLight transition duration-300 ${isActive ? " text-themeColDark dark:text-themeColLight border-b-2" : ""
                        }`
                    }
                >
                    Stream
                </NavLink>
                <NavLink
                    key={"submissions"}
                    to={"submissions"}
                    className={({ isActive }) =>
                        `block px-4 py-[6px]  hover:text-themeColDark dark:hover:text-themeColLight transition duration-300 ${isActive ? " text-themeColDark dark:text-themeColLight border-b-2" : ""
                        }`
                    }
                >
                    Submissions
                </NavLink>
                <NavLink
                    key={"people"}
                    to={"people"}
                    className={({ isActive }) =>
                        `block px-4 py-[6px] hover:text-themeColDark dark:hover:text-themeColLight transition duration-300 ${isActive ? " text-themeColDark dark:text-themeColLight border-b-2" : ""
                        }`
                    }
                >
                    People
                </NavLink>
            </div>
            <div className="flex items-center justify-center">
                <NavLink
                    key={"info"}
                    to={"info"}
                    end
                    className={({ isActive }) =>
                        `py-[6px] sm:px-0 px-2 block hover:text-themeColDark dark:hover:text-themeColLight transition duration-300 opacity-60 h-full${isActive ? " text-themeColDark dark:text-themeColLight border-b-2 opacity-100" : ""
                        }`
                    }
                >
                    <InformationCircleIcon className="w-6 h-6" />
                </NavLink>
                
            </div>
        </div>

    )
}

export default ThesisNav