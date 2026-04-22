export default function Card({ children }) {
    return (
        <div
            className="rounded-3xl border p-8 shadow-[0_8px_30px_rgba(120,90,60,0.08)]"
            style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border)",
            }}
        >
            {children}
        </div>
    );
}