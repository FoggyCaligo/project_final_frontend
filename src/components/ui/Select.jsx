import React, { useState, useRef, useEffect } from 'react';

export default function Select({ options = [], getText, setText, is_full = "false", placeholder = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(setText || "");

    // Sync with parent's setText prop
    useEffect(() => {
        setSelectedValue(setText || "");
    }, [setText]);

    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (value) => {
        setSelectedValue(value);
        getText?.(value); // Call parent handler with the selected value
        setIsOpen(false); // Close dropdown
    };

    // Determine the text to display
    let displayText = placeholder;
    if (selectedValue) {
        const selectedOption = options.find(opt => opt.value === selectedValue);
        if (selectedOption) {
            displayText = selectedOption.label;
        } else {
            // Fallback: if selectedValue is not in options but is not empty
            displayText = selectedValue;
        }
    }

    const baseClasses = "text-left text-sm font-semibold bg-white rounded-lg focus:ring-1 focus:ring-gray-300 focus:outline-none px-4 py-4 transition border cursor-pointer flex items-center justify-between";
    const fullWidthClass = is_full === "true" ? "w-full" : "";

    return (
        <div ref={dropdownRef} className={`relative ${fullWidthClass}`}>
            {/* Display area */}
            <div
                className={`${baseClasses} ${fullWidthClass}`}
                style={{
                    color: "var(--text-main)",
                    borderColor: "var(--border)",
                    height: "54px", // Consistent height with other inputs
                }}
                onClick={toggleDropdown}
            >
                <span className="flex-grow mr-2 overflow-hidden text-ellipsis whitespace-nowrap">{displayText}</span>
                {/* Arrow icon */}
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Options list (conditionally rendered) */}
            {isOpen && (
                <div
                    className={`absolute z-10 ${fullWidthClass} bg-white rounded-lg shadow-lg mt-1 border`}
                    style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--card-bg)",
                        maxHeight: "160px", // 최대 높이를 240px로 설정
                        overflowY: 'auto',  // 내용이 많을 경우 스크롤바 표시
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className="px-4 py-3 cursor-pointer text-sm font-semibold hover:bg-gray-100"
                            style={{
                                color: "var(--text-main)",
                            }}
                            onClick={() => handleOptionClick(opt.value)}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
