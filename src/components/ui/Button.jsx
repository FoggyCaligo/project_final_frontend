export default function Button({ children, variant = "primary", handleClick, is_square = false, is_full = false }) {
    const base =
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sb font-semibold transition";

    const styles = {
        primary:
            "themePrimary shadow-sm hover:opacity-90",
        secondary:
            "themeSecondary hover:opacity-90",
        accent:
            "themeAccent shadow-sm hover:opacity-90",
        square:
            "rounded-lg",
        full : 
            "w-full"
    };

    return (
        <button className={`${base} ${styles[variant]} ${is_square ? styles.square : ''} ${is_full ? styles.full : ''}`}  onClick={handleClick} type="button">
            {children}
        </button>
    );
}