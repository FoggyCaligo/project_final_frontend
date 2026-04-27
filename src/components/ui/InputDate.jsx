'use client';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function InputDate({ variant = "primary", getText, setText, placeholder = "날짜 선택", is_full = "true" }) {
    const baseClass = "text-left text-sm font-semibold rounded-lg transition h-[54px]"; // 기존 InputText와 높이 맞춤

    const onChange = (date, dateString) => {
        if (getText) {
            getText(dateString);
        }
    };

    return (
        <DatePicker
            placeholder={placeholder}
            className={`${baseClass} ${is_full === "true" ? 'w-full' : ''}`}
            variant="borderless" // 기본 보더 제거 후 커스텀 스타일 적용 가능
            style={{
                backgroundColor: 'white',
                padding: '0 16px',
                border: '1px solid var(--border, #e5e7eb)',
            }}
            value={setText ? dayjs(setText) : null}
            onChange={onChange}
            format="YYYY-MM-DD"
        />
    );
}
