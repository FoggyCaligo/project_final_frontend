export default function Button({ children, variant = "primary", handleClick, is_square = false }) {
    const base =
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sb font-semibold transition";

    const styles = {
        primary:
            "text-white shadow-sm hover:opacity-90",
        secondary:
            "border bg-white hover:opacity-90",
        accent:
            "shadow-sm hover:opacity-90",
        square:
            "rounded-lg",
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
        <button className={`${base} ${styles[variant]} ${is_square ? styles.square : ''}`} style={inlineStyle[variant]}  onClick={handleClick} type="button">
            {children}
        </button>
    );
}