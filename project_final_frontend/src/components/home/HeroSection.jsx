export default function HeroSection() {
    return (
        <section className="grid min-h-[calc(100vh-160px)] items-center gap-12 py-10 md:grid-cols-2">
            <div>
                <p className="mb-4 inline-block rounded-full bg-[#f3eee7] px-4 py-2 text-sm text-[#7c8a6a]">
                    오늘의 냉장고 · 감성 레시피 추천
                </p>

                <h1 className="text-5xl font-semibold leading-tight tracking-tight text-[#3f3a36] md:text-6xl">
                    냉장고 속 재료로
                    <br />
                    오늘의 식탁을
                    <br />
                    더 따뜻하게
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-[#6b645f]">
                    보유한 식재료를 기반으로 만들 수 있는 레시피를 추천받고,
                    부족한 재료와 커뮤니티 후기를 함께 확인해보세요.
                    복잡하지 않게, 일상에 맞는 요리를 더 쉽게 찾을 수 있습니다.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                    <button className="rounded-full bg-[#7c8a6a] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90">
                        시작하기
                    </button>
                    <button className="rounded-full border border-[#d9d0c7] bg-white px-6 py-3 text-sm font-medium text-[#5b554f] transition hover:bg-[#faf6f1]">
                        서비스 둘러보기
                    </button>
                </div>
            </div>

            <div className="relative">
                <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-[#efe7db]" />
                <div className="absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-[#e6ecdf]" />

                <div className="relative overflow-hidden rounded-[32px] border border-[#eee7df] bg-white p-6 shadow-[0_20px_60px_rgba(80,70,60,0.08)]">
                    <div className="rounded-[24px] bg-[#f8f3ed] p-6">
                        <p className="text-sm text-[#8b837c]">오늘의 추천 레시피</p>
                        <h2 className="mt-3 text-3xl font-semibold text-[#3f3a36]">
                            토마토 달걀볶음
                        </h2>
                        <p className="mt-4 leading-7 text-[#6b645f]">
                            냉장고에 있는 토마토와 달걀로 간단하게 만들 수 있는
                            한 끼 메뉴예요. 부담 없이 만들 수 있고, 재료 활용도도 높아요.
                        </p>

                        <div className="mt-8">
                            <p className="text-sm font-medium text-[#5b554f]">보유 재료</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white px-3 py-2 text-sm text-[#6b645f]">
                                    토마토
                                </span>
                                <span className="rounded-full bg-white px-3 py-2 text-sm text-[#6b645f]">
                                    달걀
                                </span>
                                <span className="rounded-full bg-white px-3 py-2 text-sm text-[#6b645f]">
                                    양파
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-[#5b554f]">부족 재료</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-[#fff7e8] px-3 py-2 text-sm text-[#9a7440]">
                                    식용유
                                </span>
                                <span className="rounded-full bg-[#fff7e8] px-3 py-2 text-sm text-[#9a7440]">
                                    소금
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}