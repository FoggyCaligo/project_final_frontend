import api from "@/config/axios";

/** 원격 `upload_fridge_image.php` — env 미설정 시 운영 도메인 기본값 */
function fridgeImagePhpUploadUrl() {
    const u =
        typeof process !== "undefined" && process.env.NEXT_PUBLIC_FRIDGE_IMAGE_UPLOAD_URL
            ? String(process.env.NEXT_PUBLIC_FRIDGE_IMAGE_UPLOAD_URL).trim()
            : "";
    return u || "https://www.todayfridge.today/upload_fridge_image.php";
}

/**
 * POST multipart: `file_id`, `images[]` (PHP 스크립트와 동일 계약)
 * @param {string|number} fileId Spring 인식 후 `file_asset.file_id`
 * @param {File[]} imageFiles 동일 바이너리(보통 1장)
 * @returns {Promise<{ success: boolean, uploaded_count: number, data: unknown }>}
 */
export async function uploadFridgeImagesToRemotePhp(fileId, imageFiles) {
    const list = Array.isArray(imageFiles) ? imageFiles.filter(Boolean) : [];
    if (list.length === 0) {
        throw new Error("업로드할 이미지 파일이 없습니다.");
    }
    const fd = new FormData();
    fd.append("file_id", String(fileId));
    list.forEach((f) => {
        fd.append("images[]", f);
    });
    const res = await fetch(fridgeImagePhpUploadUrl(), {
        method: "POST",
        body: fd,
    });
    const text = await res.text();
    let json;
    try {
        json = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(
            (text && text.slice(0, 200)) || "원격 이미지 업로드 응답이 JSON이 아닙니다."
        );
    }
    if (!res.ok) {
        throw new Error(json?.error || `원격 업로드 실패 (HTTP ${res.status})`);
    }
    if (json.success !== true) {
        throw new Error(json?.error || "원격 이미지 업로드에 실패했습니다.");
    }
    if (typeof json.uploaded_count !== "number" || json.uploaded_count < 1) {
        throw new Error("원격 서버에 이미지가 저장되지 않았습니다.");
    }
    return json;
}

function fridgeImagePhpDeleteUrl() {
    const u =
        typeof process !== "undefined" && process.env.NEXT_PUBLIC_FRIDGE_IMAGE_DELETE_URL
            ? String(process.env.NEXT_PUBLIC_FRIDGE_IMAGE_DELETE_URL).trim()
            : "";
    return u || "https://www.todayfridge.today/delete_fridge_image.php";
}

/**
 * 아파치에 저장된 vision 파일 삭제 (팀 PHP 스크립트 계약: POST multipart `file_id`)
 * 스크립트가 없으면 404일 수 있음 — 배포 시 구현 필요.
 */
export async function deleteFridgeImageOnRemotePhp(fileId) {
    const fd = new FormData();
    fd.append("file_id", String(fileId));
    const res = await fetch(fridgeImagePhpDeleteUrl(), { method: "POST", body: fd });
    const text = await res.text();
    if (!res.ok) {
        let msg = text?.slice(0, 200) || `HTTP ${res.status}`;
        try {
            const j = JSON.parse(text);
            if (j?.error) msg = j.error;
        } catch {
            /* ignore */
        }
        throw new Error(msg);
    }
}

export const fridgeApi = {
    getIngredients: () => api.get("/v1/fridge/ingredients"),
    getIngredient: (id) => api.get(`/v1/fridge/ingredients/${id}`),
    getSummary: () => api.get("/v1/fridge/summary"),
    getCategories: () => api.get("/v1/fridge/categories"),
    addIngredient: (data) => api.post("/v1/fridge/ingredients", data),
    updateIngredient: (id, data) => api.patch(`/v1/fridge/ingredients/${id}`, data),
    deleteIngredient: (id) => api.delete(`/v1/fridge/ingredients/${id}`),
    /** 등록 직후 아파치 업로드 결과를 Spring DB에 반영 */
    syncApacheImageResult: (ingredientId, body) =>
        api.patch(`/v1/fridge/ingredients/${ingredientId}/apache-image-sync`, body),
    /** 수정: 새 이미지용 file_asset 스테이징 행만 생성 */
    stageApacheImageReplace: (ingredientId, body) =>
        api.post(`/v1/fridge/ingredients/${ingredientId}/apache-image-replace-staging`, body),
    /** 수정: 스테이징 파일 아파치 업로드 후 성공/실패 반영 */
    applyApacheReplaceResult: (ingredientId, body) =>
        api.patch(`/v1/fridge/ingredients/${ingredientId}/apache-image-replace-result`, body),
    /** Spring → FastAPI 비전 파이프라인 (multipart `file`, query `topK`) */
    recognizeIngredientImage: (file, topK = 3) => {
        const fd = new FormData();
        fd.append("file", file);
        return api.post("/v1/fridge/ingredients/recognize-image", fd, {
            params: { topK },
            transformRequest: [
                (data, headers) => {
                    if (headers && typeof headers.delete === "function") {
                        headers.delete("Content-Type");
                    } else if (headers && typeof headers === "object") {
                        delete headers["Content-Type"];
                        delete headers["content-type"];
                    }
                    return data;
                },
            ],
        });
    },
};
