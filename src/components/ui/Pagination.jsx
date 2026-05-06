export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
                이전
            </button>

            <span className="text-sm text-gray-500">
                {page} / {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
                다음
            </button>
        </div>
    );
}