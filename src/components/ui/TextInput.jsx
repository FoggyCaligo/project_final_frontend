export default function TextInput({ children, variant = "primary", getText, placeholder = "" }) {
    const base =
        "text-left text-sm font-semibold bg-white rounded-lg focus:ring-1 focus:ring-gray-300 focus:outline-none px-4 py-4 transition";

    const styles = {
        primary:
            "text-white shadow-sm hover:opacity-90",
        secondary:
            "border bg-white hover:opacity-90",
        accent:
            "shadow-sm hover:opacity-90",
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
        <input type = "text" className={`${base} ${styles[variant]}`} style={inlineStyle[variant]} placeholder={placeholder} onInput={(e) => getText(e.target.value)} />
    );
}