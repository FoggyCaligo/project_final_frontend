'use client';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function InputDate({ getText, setText, placeholder = "날짜 선택", is_full = "true" }) {
    const baseClass = "text-left text-sm font-semibold h-[54px]"; // 높이 유지

    const onChange = (date, dateString) => {
        if (getText) {
            getText(dateString);
        }
    };

    return (
        <DatePicker
            placeholder={placeholder}
            className={`${baseClass} ${is_full === "true" ? 'w-full' : ''}`}
            style={{
                backgroundColor: 'white',
                padding: '0 16px',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: '22px', // 더욱 부드러운 곡률 적용 (rounded-xl 수준)
            }}
            value={setText ? dayjs(setText) : null}
            onChange={onChange}
            format="YYYY-MM-DD"
        />
    );
}
