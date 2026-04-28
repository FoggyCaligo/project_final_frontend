"use client"; // 💡 Next.js 훅을 사용하기 위해 최상단에 추가
import React from 'react';
import { useRouter } from 'next/navigation'; // 💡 useRouter 불러오기
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PostCard({ title, author, date, category, imageSrc, desc, altText }) {
    const router = useRouter(); // 💡 라우터 객체 생성

    return (
        <Card style={{ margin: 0, padding: '24px' }}>
            <div className="flex items-center justify-between gap-3 mb-3">
                <strong className="text-lg font-bold">{title}</strong>
                <span className="text-sm text-[var(--text-sub)]">{author} · {date} · {category}</span>
            </div>
            {imageSrc && (
                <div className="overflow-hidden rounded-xl mb-4 bg-[var(--soft-bg)] aspect-[16/10]">
                    <img className="w-full h-full object-cover" src={imageSrc} alt={altText || title} />
                </div>
            )}
            <p className="m-0 text-[var(--text-sub)] leading-relaxed">
                {desc}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
                {/* 💡 window.location.href 대신 router.push 사용 */}
                <Button variant="primary" handleClick={() => router.push('/community/detail')}>
                    상세 보기
                </Button>
                <Button variant="secondary">좋아요</Button>
                <Button variant="secondary">신고</Button>
            </div>
        </Card>
    );
}