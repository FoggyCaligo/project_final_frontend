import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";

export default function Ingredient({ children, variant = "primary", handleClickDelete, handleClickEdit, name, description, expires, qty }) {   

    if(new Date(expires) - new Date() < 3){
        
    }

    return (
        <div className="flex flex-row justify-between items-center p-2 rounded-2xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <div className="flex-col ml-4">
                <div className="text-lg font-bold">{name}</div>
                <div className="text-sm text-gray-600">{description} {expires} {qty}</div>
            </div>
            <div className="flex flex-row gap-2">
                <Tag variant="accent">유통기한 임박</Tag>
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