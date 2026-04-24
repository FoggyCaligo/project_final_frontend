export default function Section({ children }) {
    return (
        <section className="py-20">
            <div className="mx-auto w-full max-w-6xl ">
                {children}
            </div>
        </section>
    );
}