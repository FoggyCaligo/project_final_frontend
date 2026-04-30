export default function InputText({ children, variant = "primary", getText, setText, is_full="false", style="", placeholder = "", type="text" }) {
    const base =
        "w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]";

    const styles = {
        primary:
            "text-white hover:opacity-90",
        secondary:
            "border bg-white hover:opacity-90",
        accent:
            "hover:opacity-90",
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
            type={type}
            className={`${base} ${styles[variant]} ${is_full === "true" ? styles.full : ''} ${style !== "" ? style : ''}`} 
            style={inlineStyle[variant]} 
            placeholder={placeholder} 
            value={setText || ""}
            onChange={(e) => getText?.(e.target.value)} 
        />
    );
}