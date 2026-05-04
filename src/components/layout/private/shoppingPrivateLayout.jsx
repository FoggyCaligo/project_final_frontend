import Sidebar from "./Sidebar";
import PrivateHeader from "./PrivateHeader";

//  팀 코드 충돌 방지하기 위해 임의의 shoppingPrivateLayout 생성
export default function shoppingPrivateLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#fdfaf6] text-[#3f3a36]">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <PrivateHeader />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
