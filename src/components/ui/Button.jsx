export default function Button({ children, variant = "primary" }) {
    const base =
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition";

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
            backgroundColor: "var(--primary)",
        },
        secondary: {
            borderColor: "var(--border)",
            color: "var(--text-sub)",
        },
        accent: {
            backgroundColor: "var(--accent)",
            color: "#fff",
        },
    };

    return (
        <button className={`${base} ${styles[variant]}`} style={inlineStyle[variant]}>
            {children}
        </button>
    );
}