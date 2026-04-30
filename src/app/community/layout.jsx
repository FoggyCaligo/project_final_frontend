import React from 'react';
import PrivateLayout from '@/components/layout/private/PrivateLayout'; // 💡 경로 확인 필요

export default function CommunityLayout({ children }) {
    return (
        <PrivateLayout>
            {children}
        </PrivateLayout>
    );
}