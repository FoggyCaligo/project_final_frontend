import Sidebar2 from "./Sidebar2";
import PrivateHeader from "./PrivateHeader";
import FloatingChatbot from "@/components/chat/FloatingChatbot";

export default function PrivateLayout2({ children }) {
    return (
        <div className="flex min-h-screen bg-[#fdfaf6] text-[#3f3a36]">
            <Sidebar2 />
            <div className="flex flex-1 flex-col">
                <PrivateHeader />
                <main className="flex-1 p-6">
                    {children}
                </main>
                <FloatingChatbot />
            </div>
        </div>
    );
}
