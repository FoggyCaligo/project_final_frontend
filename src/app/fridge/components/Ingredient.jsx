import Link from "next/link";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";

// 규정: 냉장고 CRUD API 작업시작문서 v1.0 §6, 신선도규칙_확정표_초안.md
const FRESHNESS_BADGE = {
    EXPIRED:  { label: "만료됨",      variant: "accent"   },
    SOON:     { label: "유통기한 임박", variant: "accent"   },
    UNKNOWN:  { label: "기한미설정",   variant: "secondary" },
    FRESH:    null,
};

export default function Ingredient({
    ingredientId,
    children,
    variant = "primary",
    handleClickDelete,
    handleClickEdit,
    name,
    description,
    expires,
    qty,
    storageType,
    category,
    freshnessStatus,
    imageUrl,
}) {
    const badge = FRESHNESS_BADGE[freshnessStatus] ?? null;

    return (
        <div className="flex flex-row justify-between items-center p-2 rounded-2xl border gap-3" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            {imageUrl ? (
                <div className="shrink-0 h-16 w-16 overflow-hidden rounded-xl border bg-gray-100" style={{ borderColor: "var(--border)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
            ) : null}
            <div className="min-w-0 flex-1 flex-col ml-0 sm:ml-1">
                <div className="text-lg font-bold">
                    {ingredientId != null ? (
                        <Link href={`/fridge/${ingredientId}`} className="hover:underline">
                            {name}
                        </Link>
                    ) : (
                        name
                    )}
                </div>
                <div className="text-sm text-gray-600">
                    {description} {" . "} {expires}
                    {category && <>{" . "}{category}</>}
                    {" . "} {storageType} {" . "} {qty}
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">

                {badge && <Tag variant={badge.variant}>{badge.label}</Tag>}

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