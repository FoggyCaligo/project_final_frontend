import Button from "./Button"

export default function Recipe({ name, time, difficulty, imageURL, handleClick }) {
    return (
        <div className="w-full overflow-hidden rounded-2xl relative bg-gray-100 flex flex-col border border-gray-100">
            <div className="h-48 relative overflow-hidden">
                <img 
                    src={imageURL || "/next.svg"} 
                    alt={name} 
                    className="w-full h-full object-cover" 
                />
            </div>
            <div className="flex flex-col gap-1 p-4">
                <div className="text-lg font-bold text-gray-800">{name}</div>
                <div className="text-xs text-gray-500 mb-3">
                    소요 시간: {time} | 난이도: {difficulty}
                </div>
                <Button is_full="true" variant="secondary" size="sm" handleClick={handleClick}>
                    레시피 보기
                </Button>
            </div>
        </div>
    );
}
