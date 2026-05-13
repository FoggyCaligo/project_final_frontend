"use client";

import React, { useEffect, useState } from 'react';
import PrivateLayout from '@/components/layout/private/PrivateLayout';
import styles from './HealthReport.module.css';
import { healthReportApi } from '@/api/healthReportApi';

export default function HealthReportPage() {
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [report, setReport] = useState(null);   // { summary, advice: [], meals: [], videos: [] }
    const [error, setError] = useState(null);

    const fetchLatestReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await healthReportApi.getLatestHealthReport();
            setReport(data);
        } catch (err) {
            console.error("최신 건강 레포트 조회 실패:", err);
            setError('건강 레포트를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        setGenerating(true);
        setError(null);
        try {
            const data = await healthReportApi.generateHealthReport();
            setReport(data);
        } catch (err) {
            console.error("건강 레포트 생성 실패:", err);
            setError('AI 건강 레포트 생성에 실패했습니다. 식단 기록이나 냉장고 재료를 확인해 주세요.');
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        fetchLatestReport();
    }, []);

    if (loading) {
        return (
            <PrivateLayout>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>건강 레포트를 불러오고 있습니다...</p>
                </div>
            </PrivateLayout>
        );
    }

    return (
        <PrivateLayout>
            <div className={styles.container}>
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">맞춤 건강 레포트</h1>
                        <p className="text-gray-500 mt-2">AI가 분석한 식습관 및 냉장고 재료 기반 맞춤 분석 결과입니다.</p>
                    </div>
                    <button 
                        onClick={handleGenerateReport}
                        disabled={generating}
                        className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${generating ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark active:scale-95'}`}
                        style={{ backgroundColor: generating ? '#9ca3af' : 'var(--color-primary)' }}
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                분석 중...
                            </span>
                        ) : 'AI 분석 다시 받기'}
                    </button>
                </header>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {!report && !generating && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 mb-6">생성된 건강 레포트가 없습니다.</p>
                        <button 
                            onClick={handleGenerateReport}
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:shadow-xl transition-all active:scale-95"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            첫 AI 건강 분석 시작하기
                        </button>
                    </div>
                )}

                {report && (
                    <div className={generating ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                        {/* Summary Section */}
                        <section className={`${styles.glassCard} mb-8`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center" style={{backgroundColor: 'var(--color-primary-light)'}}>
                                    <svg className="w-5 h-5" style={{color: 'var(--color-primary)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                    </svg>
                                </span>
                                AI 식단 총평
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Advice Section */}
                            <section className={`${styles.glassCard}`}>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </span>
                                    영양 어드바이스
                                </h2>
                                <ul className="space-y-3">
                                    {report.advice?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Recommended Meals Section */}
                            <section className={`${styles.glassCard}`}>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                        </svg>
                                    </span>
                                    추천 식단
                                </h2>
                                <div className="space-y-4">
                                    {['아침', '점심', '저녁'].map((label, idx) => (
                                        <div key={idx} className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{label}</span>
                                                {report.videos?.[idx] && (
                                                    <a 
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(report.videos[idx])}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                                        레시피 영상
                                                    </a>
                                                )}
                                            </div>
                                            <p className="font-bold text-gray-800">{report.meals?.[idx] || '추천 결과가 없습니다.'}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </PrivateLayout>
    );
}

