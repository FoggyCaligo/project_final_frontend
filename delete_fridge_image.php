<?php
// 위치: /var/www/html
// 목적: 냉장고 재료 이미지 삭제
// 1. 완벽한 CORS 자유를 위한 와일드카드(*) 설정
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// 2. Preflight(OPTIONS) 요청에 대한 조기 응답 처리
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POST 요청 확인
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST method is allowed.']);
    exit;
}

// 3. 클라이언트에서 보낸 file_id 수신 및 보안(basename) 처리
// basename()을 사용하여 Directory Traversal 공격 원천 차단
$fileId = isset($_POST['file_id']) ? basename(trim($_POST['file_id'])) : '';
if ($fileId === '') {
    http_response_code(400);
    echo json_encode(['error' => 'file_id is missing.']);
    exit();
}

// 4. 저장 경로 설정 (upload_fridge_image.php와 동일)
$uploadDir = '/var/www/html/uploads/vision/';

// 5. 해당 file_id를 가진 파일 검색
// 확장자가 다를 수 있으므로 glob() 와일드카드(*)를 사용하여 검색
$pattern = $uploadDir . $fileId . '.*';
// 다중 파일 덮어쓰기 문제를 해결하기 위해 인덱스가 붙은 경우(_0, _1 등)도 포함 검색
$patternMultiple = $uploadDir . $fileId . '_*.*';

$filesToDelete = array_merge(glob($pattern), glob($patternMultiple));
$deletedCount = 0;

// 6. 실제 파일 삭제 로직
foreach ($filesToDelete as $file) {
    if (is_file($file)) {
        if (unlink($file)) {
            $deletedCount++;
        }
    }
}

// 이미 삭제되어 파일이 없는 경우도 HTTP 200 성공으로 처리 (멱등성 보장)
echo json_encode([
    'success' => true,
    'deleted_count' => $deletedCount,
    'message' => $deletedCount > 0 ? 'Files deleted successfully.' : 'No files found to delete (or already deleted).'
]);
?>