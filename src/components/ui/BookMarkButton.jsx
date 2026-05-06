import { useState } from "react";

export default function BookMarkButton({
    initialBookmarked = false,
    onToggle
}) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggle = async () => {
        if (isSubmitting) return;

        const next = !isBookmarked;
        setIsSubmitting(true);
        try {
            if (!onToggle) {
                setIsBookmarked(next);
                return;
            }

            const result = await onToggle(next);
            if (typeof result === "boolean") {
                setIsBookmarked(result);
            } else {
                setIsBookmarked(next);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <button
            id="bookmark"
            type="button"
            aria-pressed={isBookmarked}
            disabled={isSubmitting}
            onClick={handleToggle}
            className={`inline-flex h-11 w-20 items-center justify-center rounded-full border transition ${
                isBookmarked
                    ? "border-yellow-500 bg-yellow-100 text-yellow-600"
                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            }`}
        >
            {isSubmitting ? "..." : isBookmarked ? "★" : "☆"}
        </button>
    );
}
