import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#fdfaf6] text-[#3f3a36]">
            <Header />
            <main className="mx-auto w-full max-w-6xl px-6">{children}</main>
            <Footer />
        </div>
    );
}