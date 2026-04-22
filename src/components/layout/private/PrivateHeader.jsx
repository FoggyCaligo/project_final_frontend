import UserMenu from "./UserMenu";

export default function PrivateHeader() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-[#eee7df] bg-white px-6">
            <p className="text-base font-medium">페이지</p>
            <UserMenu />
        </header>
    );
}