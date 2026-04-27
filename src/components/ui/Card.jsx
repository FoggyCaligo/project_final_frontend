export default function Card({ children, style }) {
    return (
        <div
            className="rounded-3xl border p-8 m-4 shadow-[0_8px_30px_rgba(120,90,60,0.08)]"
            style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border)",
                ...style
            }}
        >
            {children}
        </div>
    );
}