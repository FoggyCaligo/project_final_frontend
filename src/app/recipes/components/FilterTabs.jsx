export default function FilterTabs({
    options,
    value,
    onChange
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`rounded-full border px-4 py-2 text-sm transition
                        ${value === option.value
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}