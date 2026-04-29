"use client"

import { useEffect } from 'react'
import Link from 'next/link'

/*
* ====================================================================
* 500 에러페이지입니다.
* ====================================================================
*/
export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold">문제가 발생했습니다</h2>
            <p>서버에서 에러가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
            <button
                onClick={() => reset()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                다시 시도하기
            </button>
            <Link href="/" className="text-blue-500 underline mt-4">
                홈으로 돌아가기
            </Link>
        </div>
    )
}