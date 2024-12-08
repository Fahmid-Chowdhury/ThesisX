import { useState } from 'react';
import UserClickOutside from '../../hooks/UseClickOutside';

const AdvancedFilter = ({ children }) => {
    const [show, setShow] = useState(false);
    const dropRef = UserClickOutside(()=>setShow(false))
    
    return ( 
        <div className = "w-full relative" ref={dropRef}>
            <div className='flex items-center' onClick={()=>{setShow(curr => !curr)}} >
                <button
                    className="text-black dark:text-white rounded-lg flex  items-center justify-center gap-2 opacity-70"
                >
                    <svg
                        className={`w-6 h-6 transform ${show ? 'rotate-180' : 'rotate-0'} transition-transform`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.23a1 1 0 011.41 0L10 10.59l3.36-3.36a1 1 0 111.41 1.41l-4 4a1 1 0 01-1.41 0l-4-4a1 1 0 010-1.41z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Advanced Filters
                </button>
            </div>

            <div className={show ? "visible":"invisible"}>
                <div className={`dropdown-menu z-50 w-full sm:max-w-fit absolute left-0 mt-3 bg-[hsl(220,15%,95%)] dark:bg-[hsl(0,0%,10%)] border border-[hsl(0,0,85%)] dark:border-[hsl(0,0,15%)] rounded-lg shadow ${show? "show":""}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdvancedFilter