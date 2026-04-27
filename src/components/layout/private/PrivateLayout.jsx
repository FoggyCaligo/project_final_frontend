import Sidebar from "./Sidebar";
import PrivateHeader from "./PrivateHeader";
import FloatingChatbot from "@/components/chat/FloatingChatbot";

export default function PrivateLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#fdfaf6] text-[#3f3a36]">

            {/* 왼쪽 사이드바 */}
            <Sidebar />

            {/* 오른쪽 영역 */}
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