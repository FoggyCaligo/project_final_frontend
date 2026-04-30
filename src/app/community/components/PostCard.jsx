"use client"; 
import React from 'react';
import { useRouter } from 'next/navigation'; 
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// 💡 1. props에 postId를 추가했습니다.
export default function PostCard({ postId, title, author, date, category, imageSrc, desc, altText }) {
    const router = useRouter(); 

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
                {/* 💡 2. router.push 경로에 백틱(`)을 사용하여 postId 변수를 넣어줍니다. */}
                <Button variant="primary" handleClick={() => router.push(`/community/detail/${postId}`)}>
                    상세 보기
                </Button>
                <Button variant="secondary">좋아요</Button>
                <Button variant="secondary">신고</Button>
            </div>
        </Card>
    );
}