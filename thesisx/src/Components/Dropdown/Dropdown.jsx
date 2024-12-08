import { useState } from 'react';
import UserClickOutside from '../../hooks/UseClickOutside';

const Dropdown = ({ children, trigger }) => {
    const [show, setShow] = useState(false);
    const dropRef = UserClickOutside(()=>setShow(false))
    
    return (
        <div className = "w-fit relative" onClick={()=>{setShow(curr => !curr)}} ref={dropRef}>
            <div className='flex items-center justify-center'>{trigger}</div>
            
            <div className={show ? "visible":"invisible"}>
                <ul className={`dropdown-menu z-50 min-w-max absolute right-0 mt-3 bg-[hsl(0,0,95%)] dark:bg-[hsl(0,0,5%)] divide-y divide-[hsl(0,0,90%)] dark:divide-[hsl(0,0,10%)] border border-[hsl(0,0,90%)] dark:border-[hsl(0,0,10%)] rounded-lg shadow overflow-hidden ${show? "show":""}`}>
                    {children}
                </ul>
            </div>
            
        </div>
    )
}

export function DropdownItem ({ children, onPress }) {
    return(
        <li className='flex gap-3 items-center px-4 py-2 cursor-pointer hover:bg-[hsl(0,0,90%)] dark:hover:bg-[hsl(0,0,10%)]'
            onClick={onPress}
        >
            {children}
        </li>
    )
}

export default Dropdown