export default function ProcessSection() {
    const steps = [
        {
            number: "01",
            title: "재료 등록",
            desc: "보유 식재료를 냉장고에 등록하고 현재 상태를 정리합니다.",
        },
        {
            number: "02",
            title: "레시피 추천",
            desc: "현재 가진 재료를 기반으로 만들 수 있는 요리를 추천받습니다.",
        },
        {
            number: "03",
            title: "요리 결정",
            desc: "부족한 재료와 후기를 함께 보고 오늘의 식탁을 결정합니다.",
        },
    ];

    return (
        <section id="process" className="py-24">
            <div className="mb-12 text-center">
                <p className="mb-3 text-sm font-medium tracking-wide text-[#7c8a6a]">
                    PROCESS
                </p>
                <h2 className="text-4xl font-semibold text-[#3f3a36]">
                    이용 방법도
                    <br />
                    간단하고 자연스럽게
                </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="rounded-[28px] bg-[#f6f1ea] p-8"
                    >
                        <p className="text-sm font-semibold text-[#7c8a6a]">{step.number}</p>
                        <h3 className="mt-4 text-2xl font-semibold text-[#3f3a36]">
                            {step.title}
                        </h3>
                        <p className="mt-4 leading-7 text-[#6b645f]">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}