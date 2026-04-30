export default function SubTitle({ children, color="var(----text-sub)",}) {
    const base =
        "text-sm";

    return (
        <h2 className={base} style={{color}} >
            {children}
        </h2>
    );
}