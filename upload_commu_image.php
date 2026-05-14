<?php

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowed_origins = [
    'https://today-fridge-frontend-deploy.vercel.app',
    'https://today-fridge-frontend-deploy-git-mainbackup-ddujeongs-projects.vercel.app',
];

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ... (기존 파일 업로드 및 responseData 처리 로직 시작)


// UUID v4 생성 함수
function generate_uuid4() {
    return sprintf('%04x%04x_%04x_%04x_%04x_%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// 1. 저장 경로 설정
$uploadDir = '/var/www/html/uploads/community/';

// POST 요청 확인
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST method is allowed.']);
    exit;
}

// 클라이언트에서 'images[]' 배열 형태로 전송했다고 가정
if (isset($_FILES['images'])) {
    $fileCount = count($_FILES['images']['name']);
    
    // 2. 최대 5개 이미지 제한 체크
    if ($fileCount > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Maximum 5 images are allowed.']);
        exit;
    }

    $responseData = [];

    // 파일 업로드 처리 루프
    for ($i = 0; $i < $fileCount; $i++) {
        $tmpName = $_FILES['images']['tmp_name'][$i];
        $originalName = $_FILES['images']['name'][$i];
        $error = $_FILES['images']['error'][$i];

        if ($error === UPLOAD_ERR_OK && is_uploaded_file($tmpName)) {
            // 원본 파일에서 확장자 추출
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            // 4. UUID 파일명 생성
            $uuid = generate_uuid4();
            $newFileName = $uuid . '.' . $extension;
            $destination = $uploadDir . $newFileName;

            // 5. SHA-1 해시값 추출 (임시 파일에서 계산)
            $sha1sum = sha1_file($tmpName);

            // 3. 지정된 경로로 파일 이동
            if (move_uploaded_file($tmpName, $destination)) {
                // 추가: 이동 완료된 실제 파일에서 크기 및 MIME 타입 추출
                $fileSize = filesize($destination);
                $mimeType = mime_content_type($destination);

                $responseData[] = [
                    'original_name' => $originalName,
                    'uuid_name'     => $newFileName,
                    'sha1sum'       => $sha1sum,
                    'mime_type'     => $mimeType ? $mimeType : 'application/octet-stream', // 타입을 알 수 없을 때 기본값
                    'file_size'     => $fileSize,
                    'storage_path'  => $uploadDir // 상단에 선언해둔 $uploadDir 변수 재사용
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
