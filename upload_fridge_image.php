<?php
// 위치: /var/www/html
// 목적: 냉장고 재료 이미지 업로드
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

// 3. 리액트에서 보낸 file_id 수신 확인
$fileId = isset($_POST['file_id']) ? trim($_POST['file_id']) : '';
if ($fileId === '') {
    http_response_code(400);
    echo json_encode(['error' => 'file_id is missing.']);
    exit();
}

// 4. 저장 경로 설정 (폴더가 없으면 생성)
$uploadDir = '/var/www/html/uploads/vision/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// 5. 클라이언트에서 'images[]' 배열 형태로 전송했다고 가정
if (isset($_FILES['images'])) {
    $fileCount = count($_FILES['images']['name']);
    $responseData = [];

    // 파일 업로드 처리 루프
    for ($i = 0; $i < $fileCount; $i++) {
        $tmpName = $_FILES['images']['tmp_name'][$i];
        $originalName = $_FILES['images']['name'][$i];
        $error = $_FILES['images']['error'][$i];

        if ($error === UPLOAD_ERR_OK && is_uploaded_file($tmpName)) {
            // 원본 파일에서 확장자 추출
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            // UUID 대신 file_id를 사용하여 파일명 생성 (예: 13.jpg)
            $newFileName = $fileId . '.' . $extension;
            $destination = $uploadDir . $newFileName;

            // SHA-1 해시값 추출 (임시 파일에서 계산)
            $sha1sum = sha1_file($tmpName);

            // 지정된 경로로 파일 이동
            if (move_uploaded_file($tmpName, $destination)) {
                // 이동 완료된 실제 파일에서 크기 및 MIME 타입 추출
                $fileSize = filesize($destination);
                $mimeType = mime_content_type($destination);

                $responseData[] = [
                    'file_id'       => $fileId,
                    'original_name' => $originalName,
                    'stored_name'   => $newFileName,
                    'sha1sum'       => $sha1sum,
                    'mime_type'     => $mimeType ? $mimeType : 'application/octet-stream',
                    'file_size'     => $fileSize,
                    'storage_path'  => $uploadDir
                ];
            } else {
                $responseData[] = [
                    'original_name' => $originalName,
                    'error'         => 'Failed to save file on server.'
                ];
            }
        }
    }

    // 최종 결과 응답
    echo json_encode([
        'success'        => true,
        'uploaded_count' => count($responseData),
        'data'           => $responseData
    ]);

} else {
    http_response_code(400);
    echo json_encode(['error' => 'No image files found in the request. Please use "images[]" as the field name.']);
}
?>
