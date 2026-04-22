export default function FeatureSection() {
    const features = [
        {
            title: "재료 관리",
            desc: "냉장고 속 식재료를 등록하고 유통기한과 상태를 쉽게 관리할 수 있어요.",
        },
        {
            title: "맞춤 레시피 추천",
            desc: "보유한 재료와 사용자 조건을 기준으로 만들 수 있는 요리를 추천해요.",
        },
        {
            title: "커뮤니티 공유",
            desc: "다른 사용자들의 후기와 게시글을 참고하며 더 좋은 선택을 할 수 있어요.",
        },
    ];

    return (
        <section id="features" className="py-24">
            <div className="mb-12 text-center">
                <p className="mb-3 text-sm font-medium tracking-wide text-[#7c8a6a]">
                    FEATURES
                </p>
                <h2 className="text-4xl font-semibold text-[#3f3a36]">
                    필요한 기능만 담아
                    <br />
                    더 단순하고 편안하게
                </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="rounded-[28px] border border-[#eee7df] bg-white p-8 shadow-[0_10px_30px_rgba(80,70,60,0.05)] transition hover:-translate-y-1"
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3eee7] text-[#7c8a6a]">
                            ✦
                        </div>
                        <h3 className="text-2xl font-semibold text-[#3f3a36]">
                            {feature.title}
                        </h3>
                        <p className="mt-4 leading-7 text-[#6b645f]">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}