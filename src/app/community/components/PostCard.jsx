// src/app/community/components/PostCard.jsx
import React from 'react';

export default function PostCard({ title, author, date, category, imageSrc, desc, altText }) {
    return (
        <article className="card-box post-card">
            <div className="post-header">
                <strong>{title}</strong>
                <span className="post-meta">{author} · {date} · {category}</span>
            </div>
            {imageSrc && (
                <div className="image-box image-rounded thumb-16-10 mb-4">
                    <img className="image-cover" src={imageSrc} alt={altText || title} />
                </div>
            )}
            <p className="card-desc">
                {desc}
            </p>
            <div className="card-actions">
                <a className="btn btn-primary" href="/community/detail">상세 보기</a>
                <button className="btn btn-outline" type="button">좋아요</button>
                <button className="btn btn-outline" type="button">신고</button>
            </div>
        </article>
    );
}
