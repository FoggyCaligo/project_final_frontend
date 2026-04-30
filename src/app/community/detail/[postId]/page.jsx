"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPostDetail, deletePost } from '@/api/postApi';

export default function CommunityDetailPage() {
    const { postId } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const currentUserId = 1; // 실제 서비스 시 세션/토큰에서 가져옴

    useEffect(() => {
        const fetchDetail = async () => {
            const data = await getPostDetail(postId);
            setPost(data);
        };
        fetchDetail();
    }, [postId]);

    const handleDelete = async () => {
        if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            await deletePost(postId);
            alert("삭제되었습니다.");
            router.push('/community');
        }
    };

    if (!post) return <div className="p-10 text-center">로딩 중...</div>;

    const isAuthor = post.authorUserId === currentUserId;

    return (
        <main className="layout-container py-8">
            <article className="card-box post-card">
                <div className="post-header flex justify-between items-center mb-4">
                    <strong className="text-xl">{post.title}</strong>
                    <span className="post-meta">{post.authorLoginId} · {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                {/* 첫 번째 이미지 렌더링 */}
                <div className="image-box image-rounded thumb-16-10 mb-5">
                    <img className="image-cover" src={post.images?.[0] ? `http://43.201.1.45/uploads/community/${post.images[0].storedName}` : "/placeholder.svg"} alt="상세" />
                </div>
                
                <p className="card-desc mb-6">{post.content}</p>
                
                <div className="card-actions flex gap-2">
                    {isAuthor ? (
                        <>
                            <button className="btn btn-outline" onClick={() => router.push(`/community/edit/${postId}`)}>수정</button>
                            <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-primary">좋아요</button>
                            <button className="btn btn-outline">팔로우</button>
                            <button className="btn btn-outline">신고하기</button>
                        </>
                    )}
                    <button className="btn btn-secondary" onClick={() => router.push(`/recipes/${post.recipeId}`)}>레시피 보기</button>
                </div>
            </article>
        </main>
    );
}