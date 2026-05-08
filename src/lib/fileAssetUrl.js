/**
 * DB `file_asset.storage_path` (예: vision/uuid.jpg) → 브라우저 URL
 * Next.js rewrite: /api/images/:path* → http://43.201.1.45/uploads/:path*
 * Mixed Content 방지: HTTPS Vercel이 HTTP 이미지 서버를 프록시
 */
export function fileAssetPublicUrl(imageStoragePath, imageStoredName) {
    const path = imageStoragePath || imageStoredName;
    if (!path) return null;
    const clean = String(path).replace(/^\/+/, "").replace(/^uploads\//, "");
    return `/api/images/${clean}`;
}
