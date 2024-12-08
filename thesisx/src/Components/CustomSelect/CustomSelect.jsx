import { useState } from 'react';
import UserClickOutside from '../../hooks/UseClickOutside';
const CustomSelect = ({ value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = UserClickOutside(()=>setIsOpen(false))

    const selectedOption = options.find(option => option.value === value);
    const selectedLabel = selectedOption ? selectedOption.label : '';

    const handleOptionClick = (optionValue) => {
        onChange(optionValue); // Pass the selected option value to the parent
        setIsOpen(false); // Close the dropdown after selection
    };

    return (
        <div className="relative" ref={dropRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center border outline-1 border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg py-2 px-4 bg-transparent text-left"
            >
                <span>{selectedLabel || 'Select an option'}</span>
                <svg
                    className={`w-6 h-6 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`}
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
            </button>
            {isOpen && (
                <ul
                    className="absolute w-full animate-into-view-1 mt-1 bg-[hsl(0,0,95%)] dark:bg-[hsl(0,0,5%)] border border-[hsl(0,0,30%)] dark:border-[hsl(0,0,70%)] rounded-lg shadow-md z-10 overflow-visible"
                    role="listbox"
                    
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className="cursor-pointer px-4 py-2 text-sm text-black dark:text-white hover:bg-[hsl(0,0,85%)] dark:hover:bg-[hsl(0,0,15%)]"
                            role="option"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
