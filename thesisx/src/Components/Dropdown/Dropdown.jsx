import { useState } from 'react';

const Dropdown = ({ children, trigger }) => {
    const [show, setShow] = useState(false);

    
    return (
        <div className = "w-fit relative" onClick={()=>{setShow(curr => !curr)}}>
            <div>{trigger}</div>
            { show &&
                <ul className="min-w-max absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow overflow-hidden">
                    {children}
                </ul>
            }
        </div>
    )
}

export function DropdownItem ({ children }) {
    return(
        <>
        <li className='flex gap-3 items-center px-4 py-2 cursor-pointer'>
            {children}
        </li>
        </>
    )
}

export default Dropdown