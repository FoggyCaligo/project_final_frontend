export default function TextInput({ children, variant = "primary" }) {
    const base =
        "text-left bg-white rounded-lg focus:ring-1 focus:ring-gray-300 focus:outline-none transition w-full px-4 py-2";

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
        <input type = "text" className={`${base} ${styles[variant]}`} style={inlineStyle[variant]} placeholder="텍스트 입력" />
    );
}