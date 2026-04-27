import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";


export default function Ingredient({ children, variant = "primary", handleClickDelete, handleClickEdit, name, description, expires, qty, storageType }) {   
    
    const expirationDate = new Date(expires);
    const today = new Date();
    const diffInMs = expirationDate - today;
    const isImminent = diffInMs < (3 * 24 * 60 * 60 * 1000);
    const isExpired = expirationDate < today;
    return (
        <div className="flex flex-row justify-between items-center p-2 rounded-2xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="flex-col ml-4">
                <div className="text-lg font-bold">{name}</div>
                <div className="text-sm text-gray-600">{description} {" . "} {expires} {" . "} {storageType} {" . "} {qty}</div>
            </div>
            <div className="flex flex-row gap-2 items-center">

                {isImminent && <Tag variant="accent">유통기한 경고</Tag>}

                <Button variant="secondary" is_square={true} handleClick={handleClickEdit}>
                    수정
                </Button>
                <Button variant="accent" is_square={true} handleClick={handleClickDelete}>
                    삭제
                </Button>
            </div>
        </div>
    );
}