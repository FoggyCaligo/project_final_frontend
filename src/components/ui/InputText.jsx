export default function InputText({ children, variant = "primary", getText, setText, is_full="false", placeholder = "" }) {
    const base =
        "text-left text-sm font-semibold bg-white rounded-lg focus:ring-1 focus:ring-gray-300 focus:outline-none px-4 py-4 transition";

    const styles = {
        primary:
            "text-white shadow-sm hover:opacity-90",
        secondary:
            "border bg-white hover:opacity-90",
        accent:
            "shadow-sm hover:opacity-90",
        full:
            "w-full",
    };
    const inlineStyle = {
        primary: {
           color: "var(--text-main)",
        },
        secondary: {
            color: "var(--text-sub)",
        },
        accent: {
            color: "var(--accent)",
        },
    };

    return (
        <input 
            type="text" 
            className={`${base} ${styles[variant]} ${is_full === "true" ? styles.full : ''}`} 
            style={inlineStyle[variant]} 
            placeholder={placeholder} 
            value={setText || ""}
            onChange={(e) => getText?.(e.target.value)} 
        />
    );
}