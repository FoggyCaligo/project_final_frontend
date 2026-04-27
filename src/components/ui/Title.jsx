import React from 'react'; // (필요한 경우)

export default function Title({ children, color = "var(--text-main)" }) {
    const base = "text-lg font-bold";

    return (
        <h2 className={base} style={{ color }}>
            {children}
        </h2>
    );
}