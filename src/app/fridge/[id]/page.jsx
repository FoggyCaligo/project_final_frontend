"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import PrivateLayout from "@/components/layout/private/PrivateLayout";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import { fridgeApi } from "@/api/fridgeApi";
import { fileAssetPublicUrl } from "@/lib/fileAssetUrl";
import { normalizeIngredientItem } from "@/lib/fridgeApiNormalize";

const StorageType2Kor = {
    REFRIGERATED: "냉장",
    FROZEN: "냉동",
    ROOM_TEMP: "실온",
    UNKNOWN: "알 수 없음",
};

export default function FridgeIngredientDetailPage({ params }) {
    const { id } = use(params);
    const [row, setRow] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fridgeApi.getIngredient(id);
                const raw = res.data?.data;
                if (!cancelled) {
                    setRow(raw ? normalizeIngredientItem(raw) : null);
                }
            } catch (e) {
                if (!cancelled) {
                    setErr(e?.message ?? "조회 실패");
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const imageUrl = row
        ? fileAssetPublicUrl(row.imageStoragePath, row.imageStoredName)
        : null;

    return (
        <PrivateLayout>
            <Section>
                <div className="mb-4">
                    <Link href="/fridge" className="text-sm text-gray-600 hover:underline">
                        ← 냉장고 목록
                    </Link>
                </div>
                <Card>
                    {err && <p className="text-red-600">{err}</p>}
                    {!row && !err && <p className="text-gray-600">불러오는 중…</p>}
                    {row && (
                        <div className="flex flex-col gap-4">
                            <Title>{row.name}</Title>
                            {imageUrl ? (
                                <div
                                    className="max-w-md overflow-hidden rounded-2xl border bg-gray-50"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageUrl}
                                        alt={row.name}
                                        className="w-full max-h-[min(70vh,480px)] object-contain"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">등록된 사진이 없습니다.</p>
                            )}
                            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="font-semibold text-gray-700">유통기한</dt>
                                    <dd>{row.expirationDate ?? "—"}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-700">보관</dt>
                                    <dd>
                                        {StorageType2Kor[row.storageType] ?? row.storageType ?? "—"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-700">수량</dt>
                                    <dd>
                                        {row.quantity ?? "—"} {row.unit ? String(row.unit) : ""}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-700">신선도</dt>
                                    <dd>{row.freshnessStatus ?? "—"}</dd>
                                </div>
                                {row.category && (
                                    <div className="sm:col-span-2">
                                        <dt className="font-semibold text-gray-700">카테고리</dt>
                                        <dd>{row.category}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    )}
                </Card>
            </Section>
        </PrivateLayout>
    );
}
